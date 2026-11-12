export type Booking = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  phone: string;
  purpose: string;
  description?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending';
  paymentMethod?: string;
  paymentReference?: string;
};

export const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];
