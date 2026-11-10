import { randomBytes } from 'node:crypto';
import { ObjectId, type Collection } from 'mongodb';
import { getDatabase } from '../config/database';
import { calculateBookingAmount } from '../utils/pricing';

type DurationType = 'full-day' | 'half-day' | 'custom';
type PaymentMethod = 'mpesa' | 'bank-transfer' | 'cash';

type BookingInput = {
  activity: string;
  dates: string[];
  durationType: DurationType;
  halfDay?: 'morning' | 'afternoon' | null;
  startTime?: string | null;
  endTime?: string | null;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  notes?: string;
};

type SlotReservation = {
  date: string;
  hour: number;
  bookingId: string;
  reference: string;
};

const ACTIVITIES = new Set([
  'press-conference',
  'meeting',
  'workshop',
  'birthday',
  'other',
]);

const TIME_PATTERN = /^(0[8-9]|1[0-9]|20):00$/;

function localToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function validateDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date &&
    date >= localToday()
  );
}

function getTimeRange(input: BookingInput): [number, number] {
  if (input.durationType === 'full-day') return [8, 20];

  if (input.durationType === 'half-day') {
    if (input.halfDay === 'morning') return [8, 13];
    if (input.halfDay === 'afternoon') return [13, 18];
    throw new Error('Choose morning or afternoon for a half-day booking.');
  }

  if (
    !input.startTime ||
    !input.endTime ||
    !TIME_PATTERN.test(input.startTime) ||
    !TIME_PATTERN.test(input.endTime)
  ) {
    throw new Error('Custom bookings must use whole-hour times between 08:00 and 20:00.');
  }

  const start = Number(input.startTime.slice(0, 2));
  const end = Number(input.endTime.slice(0, 2));

  if (end <= start) throw new Error('End time must be later than start time.');
  return [start, end];
}

function makeSlots(
  dates: string[],
  start: number,
  end: number,
  bookingId: string,
  reference: string,
): SlotReservation[] {
  return dates.flatMap((date) =>
    Array.from({ length: end - start }, (_, index) => ({
      date,
      hour: start + index,
      bookingId,
      reference,
    })),
  );
}

function collections() {
  const db = getDatabase();
  return {
    bookings: db.collection('bookings'),
    slots: db.collection<SlotReservation>('booking_slots'),
  };
}

let indexesReady: Promise<void> | undefined;

async function ensureIndexes(): Promise<void> {
  if (!indexesReady) {
    indexesReady = (async () => {
      const { bookings, slots } = collections();
      await slots.createIndex({ date: 1, hour: 1 }, { unique: true });
      await slots.createIndex({ bookingId: 1 });
      await bookings.createIndex({ reference: 1 }, { unique: true });
      await bookings.createIndex({ status: 1, createdAt: -1 });
    })().catch((error) => {
      indexesReady = undefined;
      throw error;
    });
  }

  await indexesReady;
}

export async function checkAvailability(input: BookingInput) {
  validateInput(input);
  const [start, end] = getTimeRange(input);
  const { slots } = collections();
  await ensureIndexes();

  const conflicts = await slots
    .find({
      date: { $in: input.dates },
      hour: { $gte: start, $lt: end },
    })
    .project({ _id: 0, date: 1, hour: 1 })
    .toArray();

  return {
    available: conflicts.length === 0,
    conflicts: conflicts.map((slot) => ({
      date: slot.date,
      time: `${String(slot.hour).padStart(2, '0')}:00`,
    })),
  };
}

function validateInput(input: BookingInput): void {
  if (!input || typeof input !== 'object') throw new Error('Provide booking details.');
  if (!ACTIVITIES.has(input.activity)) throw new Error('Choose a valid activity.');
  if (!Array.isArray(input.dates) || input.dates.length < 1 || input.dates.length > 90) {
    throw new Error('Choose between 1 and 90 booking dates.');
  }
  if (new Set(input.dates).size !== input.dates.length) {
    throw new Error('Duplicate booking dates are not allowed.');
  }
  if (!input.dates.every((date) => typeof date === 'string' && validateDate(date))) {
    throw new Error('One or more dates are invalid or in the past.');
  }
  if (!['full-day', 'half-day', 'custom'].includes(input.durationType)) {
    throw new Error('Choose a valid booking duration.');
  }
  if (!['mpesa', 'bank-transfer', 'cash'].includes(input.paymentMethod)) {
    throw new Error('Choose a valid payment method.');
  }
  if (typeof input.fullName !== 'string' || input.fullName.trim().length < 2 || input.fullName.length > 120) {
    throw new Error('Enter your full name.');
  }
  if (typeof input.phone !== 'string' || input.phone.trim().length < 5 || input.phone.length > 40) {
    throw new Error('Enter a valid phone number.');
  }
  if (typeof input.whatsapp !== 'string' || input.whatsapp.trim().length < 5 || input.whatsapp.length > 40) {
    throw new Error('Enter a valid WhatsApp number.');
  }
  if (input.notes !== undefined && (typeof input.notes !== 'string' || input.notes.length > 2000)) {
    throw new Error('Notes must be 2,000 characters or fewer.');
  }
  if (
    input.durationType !== 'custom' &&
    input.paymentMethod !== 'cash' &&
    (typeof input.paymentReference !== 'string' || input.paymentReference.trim().length < 2)
  ) {
    throw new Error('Provide the payment reference for this payment method.');
  }
}


export async function createBooking(input: BookingInput) {
  validateInput(input);
  const [start, end] = getTimeRange(input);
  const db = getDatabase();
  const { bookings, slots } = collections();

  await ensureIndexes();

  const bookingId = new ObjectId().toHexString();
  const reference = `TRC-${randomBytes(4).toString('hex').toUpperCase()}`;
  const reservations = makeSlots(
    input.dates,
    start,
    end,
    bookingId,
    reference,
  );

  const booking = {
    _id: new ObjectId(bookingId),
    reference,
    activity: input.activity,
    dates: input.dates,
    durationType: input.durationType,
    halfDay: input.durationType === 'half-day' ? input.halfDay : null,
    startTime: `${String(start).padStart(2, '0')}:00`,
    endTime: `${String(end).padStart(2, '0')}:00`,
    customerName: input.fullName.trim(),
    phone: input.phone.trim(),
    whatsapp: input.whatsapp.trim(),
    paymentMethod: input.paymentMethod,
    paymentReference: input.paymentReference?.trim() || '',
    notes: input.notes?.trim() || '',
    amount: calculateBookingAmount(input.durationType, input.dates.length),
    status: 'PENDING',
    paymentStatus: 'PENDING',
    createdAt: new Date(),
  };

  const session = db.client.startSession();

  try {
    await session.withTransaction(async () => {
      // The unique (date, hour) index prevents conflicting reservations.
      // Both writes participate in the same transaction.
      await slots.insertMany(reservations, {
        ordered: true,
        session,
      });

      await bookings.insertOne(booking, { session });
    });

    return {
      id: bookingId,
      reference,
      dates: input.dates,
      startTime: booking.startTime,
      endTime: booking.endTime,
      amount: booking.amount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new Error(
        'One or more selected time slots have just been booked. Please choose another time.',
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

export async function listAvailability(start: string, end: string) {
  const isValidDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const parsed = new Date(`${value}T12:00:00`);

    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  };

  if (
    !isValidDate(start) ||
    !isValidDate(end) ||
    start > end
  ) {
    throw new Error('Provide a valid availability start and end date.');
  }

  const startDate = new Date(`${start}T12:00:00Z`);
  const endDate = new Date(`${end}T12:00:00Z`);
  const days = Math.round(
    (endDate.getTime() - startDate.getTime()) / 86_400_000,
  ) + 1;

  if (days > 42) {
    throw new Error('Request availability for no more than 42 days.');
  }

  const { slots } = collections();

  await ensureIndexes();

  const reservations = await slots
    .find({
      date: { $gte: start, $lte: end },
      hour: { $gte: 8, $lt: 20 },
    })
    .project({ _id: 0, date: 1, hour: 1 })
    .toArray();

  const bookedByDate = new Map<string, Set<number>>();

  for (const reservation of reservations) {
    const hours = bookedByDate.get(reservation.date) ?? new Set<number>();
    hours.add(reservation.hour);
    bookedByDate.set(reservation.date, hours);
  }

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(startDate.getTime() + index * 86_400_000)
      .toISOString()
      .slice(0, 10);

    const booked = bookedByDate.get(date) ?? new Set<number>();

    const availableSlots = Array.from({ length: 12 }, (_, hourIndex) => {
      const hour = hourIndex + 8;

      return {
        time: `${String(hour).padStart(2, '0')}:00`,
        status: booked.has(hour) ? 'booked' as const : 'available' as const,
      };
    });

    const availableCount = availableSlots.filter(
      (slot) => slot.status === 'available',
    ).length;

    return {
      date,
      status: availableCount === 0
        ? 'full' as const
        : availableCount === 12
          ? 'available' as const
          : 'limited' as const,
      slots: availableSlots,
    };
  });
}
