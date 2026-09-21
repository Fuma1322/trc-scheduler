export type BookingStep = 'activity' | 'datetime' | 'payment';

export type BookingDuration = 'full-day' | 'half-day' | 'custom';

export type HalfDay = 'morning' | 'afternoon';

export type PaymentMethod = 'mpesa' | 'bank-transfer' | 'cash';

export type BookingData = {
  // Activity
  activity: string | null;

  // Booking dates
  dates: Date[];

  // Booking duration
  durationType: BookingDuration | null;

  // Used when durationType is "half-day"
  halfDay: HalfDay | null;

  // Used when durationType is "custom"
  startTime: string | null;
  endTime: string | null;

  // Payment
  paymentMethod: PaymentMethod | null;
  paymentReference: string;

  // Customer details
  fullName: string;
  phone: string;
  whatsapp: string;
  notes: string;
};

export const initialBookingData: BookingData = {
  // Activity
  activity: null,

  // Booking dates
  dates: [],

  // Duration
  durationType: null,
  halfDay: null,

  // Custom hours
  startTime: null,
  endTime: null,

  // Payment
  paymentMethod: null,
  paymentReference: '',

  // Customer details
  fullName: '',
  phone: '',
  whatsapp: '',
  notes: '',
};
