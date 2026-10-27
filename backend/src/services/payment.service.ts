import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REJECTED' | 'REFUNDED';

type BookingRecord = {
  _id: ObjectId;
  reference?: string;
  activity?: string;
  dates?: string[];
  durationType?: string;
  halfDay?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  customerName?: string;
  phone?: string;
  whatsapp?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  amount?: number | null;
  status?: string;
  paymentStatus?: string;
  createdAt?: Date | string;
  paymentVerifiedAt?: Date | string | null;
  paymentVerifiedBy?: string | null;
  updatedAt?: Date;
};

const PAYMENT_STATUSES: PaymentStatus[] = [
  'PENDING',
  'PAID',
  'REJECTED',
  'REFUNDED',
];

function bookings() {
  return getDatabase().collection<BookingRecord>('bookings');
}

function dateText(value?: Date | string | null): string | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toPayment(record: BookingRecord) {
  const dates = Array.isArray(record.dates) ? record.dates : [];

  return {
    id: record._id.toString(),
    reference: record.reference ?? '',
    bookingReference: record.reference ?? '',
    customerName: record.customerName ?? '',
    customerPhone: record.phone ?? '',
    phone: record.phone ?? '',
    whatsapp: record.whatsapp ?? '',
    purpose: record.activity ?? '',
    dates,
    date: dates[0] ?? '',
    time: record.startTime && record.endTime
      ? `${record.startTime} - ${record.endTime}`
      : record.durationType === 'full-day'
        ? '08:00 - 20:00'
        : '',
    startTime: record.startTime ?? '',
    endTime: record.endTime ?? '',
    durationType: record.durationType ?? '',
    halfDay: record.halfDay ?? null,
    amount: typeof record.amount === 'number' ? record.amount : null,
    method: record.paymentMethod ?? '',
    paymentMethod: record.paymentMethod ?? '',
    paymentReference: record.paymentReference ?? '',
    status: record.paymentStatus ?? 'PENDING',
    paymentStatus: record.paymentStatus ?? 'PENDING',
    submittedAt: dateText(record.createdAt),
    createdAt: dateText(record.createdAt),
    verifiedAt: dateText(record.paymentVerifiedAt),
    verifiedBy: record.paymentVerifiedBy ?? null,
    bookingStatus: record.status ?? 'PENDING',
    notes: record.notes ?? '',
  };
}

export async function listPayments(status?: string) {
  if (
    status &&
    status !== 'ALL' &&
    !PAYMENT_STATUSES.includes(status as PaymentStatus)
  ) {
    throw new Error('Invalid payment status filter.');
  }

  const filter = status && status !== 'ALL'
    ? { paymentStatus: status }
    : {};

  const records = await bookings()
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return records.map(toPayment);
}

export async function updatePaymentStatus(
  id: string,
  status: string,
  adminEmail: string,
) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid booking ID.');
  }

  if (!PAYMENT_STATUSES.includes(status as PaymentStatus)) {
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

  return {
    id,
    paymentStatus: status,
    paymentVerifiedAt: verified ? new Date().toISOString() : null,
    paymentVerifiedBy: verified ? adminEmail : null,
  };
}
