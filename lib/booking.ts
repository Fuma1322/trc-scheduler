export type BookingStep =
  | 'activity'
  | 'datetime'
  | 'payment'
  | 'details';

export type BookingData = {
  activity: string | null;
  date: Date | null;
  timeSlot: string | null;

  paymentReference: string;

  fullName: string;
  phone: string;
  whatsapp: string;
  notes: string;
};

export const initialBookingData: BookingData = {
  activity: null,
  date: null,
  timeSlot: null,

  paymentReference: '',

  fullName: '',
  phone: '',
  whatsapp: '',
  notes: '',
};
