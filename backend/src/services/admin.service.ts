import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

type BookingRecord = {
  _id: ObjectId;
  reference?: string;
  activity?: string;
  dates?: string[];
  durationType?: string;
  halfDay?: string | null;
  startTime?: string;
  endTime?: string;
  customerName?: string;
  phone?: string;
  whatsapp?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  amount?: number | null;
  status?: string;
  paymentStatus?: string;
  createdAt?: Date;
  paymentVerifiedAt?: Date | null;
  paymentVerifiedBy?: string | null;
};

function bookings() {
  return getDatabase().collection<BookingRecord>('bookings');
}

function money(amount?: number | null): number | null {
  return typeof amount === 'number' && Number.isFinite(amount)
    ? amount
    : null;
}

function dateText(value?: Date | string): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function toBooking(record: BookingRecord) {
  return {
    id: record._id.toString(),
    reference: record.reference ?? '',
    customerName: record.customerName ?? '',
    phone: record.phone ?? '',
    whatsapp: record.whatsapp ?? '',
    purpose: record.activity ?? 'other',
    dates: record.dates ?? [],
    date: record.dates?.[0] ?? '',
    time: `${record.startTime ?? ''} - ${record.endTime ?? ''}`,
    startTime: record.startTime ?? '',
    endTime: record.endTime ?? '',
    durationType: record.durationType ?? '',
    halfDay: record.halfDay ?? null,
    amount: money(record.amount),
    paymentMethod: record.paymentMethod ?? '',
    paymentReference: record.paymentReference ?? '',
    notes: record.notes ?? '',
    status: record.status ?? 'PENDING',
    paymentStatus: record.paymentStatus ?? 'PENDING',
    createdAt: dateText(record.createdAt),
    verifiedAt: dateText(record.paymentVerifiedAt ?? undefined),
    verifiedBy: record.paymentVerifiedBy ?? null,
  };
}

export async function getDashboard() {
  const collection = bookings();
  const [
    totalBookings,
    pendingBookings,
    paidPayments,
    pendingPayments,
    totalCustomers,
    upcoming,
  ] = await Promise.all([
    collection.countDocuments(),
    collection.countDocuments({ status: 'PENDING' }),
    collection.countDocuments({ paymentStatus: 'PAID' }),
    collection.countDocuments({ paymentStatus: 'PENDING' }),
    collection.aggregate([
      {
        $group: {
          _id: {
            $ifNull: ['$phone', '$customerName'],
          },
        },
      },
      { $count: 'total' },
    ]).toArray(),
    collection.find({
      dates: { $elemMatch: { $gte: new Date().toISOString().slice(0, 10) } },
      status: { $nin: ['REJECTED', 'CANCELLED'] },
    }).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  return {
    stats: {
      totalBookings,
      pendingBookings,
      paidPayments,
      pendingPayments,
      totalCustomers: totalCustomers[0]?.total ?? 0,
    },
    upcomingBookings: upcoming.map(toBooking),
  };
}

export async function listBookings(status?: string) {
  const filter = status && status !== 'ALL'
    ? { status }
    : {};

  const records = await bookings()
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return records.map(toBooking);
}

export async function updateBookingStatus(id: string, status: string) {
  const allowed = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid booking ID.');
  }
  if (!allowed.includes(status)) {
    throw new Error('Invalid booking status.');
  }

  const result = await bookings().updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
  );

  if (!result.matchedCount) {
    throw new Error('Booking not found.');
  }

  return { id, status };
}

export async function listPayments(status?: string) {
  const filter = status && status !== 'ALL'
    ? { paymentStatus: status }
    : {};

  const records = await bookings()
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return records.map((record) => {
    const booking = toBooking(record);

    return {
      ...booking,
      bookingReference: booking.reference,
      customerPhone: booking.phone,
      submittedAt: booking.createdAt,
      verifiedAt: booking.verifiedAt || null,
      status: booking.paymentStatus,
      verifiedBy: booking.verifiedBy,
    };
  });
}

export async function updatePaymentStatus(
  id: string,
  status: string,
  adminEmail: string,
) {
  const allowed = ['PENDING', 'PAID', 'REJECTED', 'REFUNDED'];

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid booking ID.');
  }
  if (!allowed.includes(status)) {
    throw new Error('Invalid payment status.');
  }

  const verified = status === 'PAID' || status === 'REJECTED';
  const result = await bookings().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        paymentStatus: status,
        paymentVerifiedAt: verified ? new Date() : null,
        paymentVerifiedBy: verified ? adminEmail : null,
        updatedAt: new Date(),
      },
    },
  );

  if (!result.matchedCount) {
    throw new Error('Booking not found.');
  }

  return { id, paymentStatus: status };
}

export async function listCustomers() {
  const records = await bookings()
    .find({})
    .sort({ createdAt: -1 })
    .limit(2000)
    .toArray();

  const customers = new Map<string, {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    totalBookings: number;
    totalSpent: number;
    lastBooking: string;
    createdAt: string;
    bookings: ReturnType<typeof toBooking>[];
  }>();

  for (const record of records) {
    const phone = record.phone?.trim() ?? '';
    const name = record.customerName?.trim() ?? '';
    const key = phone || `${name.toLowerCase()}-${record.whatsapp ?? ''}`;

    if (!key) continue;

    let customer = customers.get(key);

    if (!customer) {
      customer = {
        id: record._id.toString(),
        name,
        phone,
        whatsapp: record.whatsapp ?? '',
        email: '',
        totalBookings: 0,
        totalSpent: 0,
        lastBooking: record.dates?.[0] ?? '',
        createdAt: dateText(record.createdAt),
        bookings: [],
      };
      customers.set(key, customer);
    }

    const booking = toBooking(record);
    customer.totalBookings += 1;
    if (record.paymentStatus === 'PAID') {
      customer.totalSpent += money(record.amount) ?? 0;
    }
    customer.bookings.push(booking);
  }

  return Array.from(customers.values());
}

export async function listCalendar(start: string, end: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(end) ||
    start > end
  ) {
    throw new Error('Provide a valid calendar start and end date.');
  }

  const records = await bookings().find({
    dates: { $elemMatch: { $gte: start, $lte: end } },
    status: { $nin: ['REJECTED', 'CANCELLED'] },
  }).sort({ createdAt: -1 }).limit(1000).toArray();

  return records.map(toBooking);
}
