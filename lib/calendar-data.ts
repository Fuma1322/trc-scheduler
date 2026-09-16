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

export const demoBookings: Booking[] = [
  {
    id: 'TRC-001',
    date: '2026-09-17',
    startTime: '10:00',
    endTime: '13:00',
    customerName: 'John Mokoena',
    phone: '+266 5800 1234',
    purpose: 'Wedding',
    description: 'Wedding reception for approximately 120 guests.',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'M-Pesa',
    paymentReference: 'MPX783421',
  },

  {
    id: 'TRC-002',
    date: '2026-09-17',
    startTime: '15:00',
    endTime: '17:00',
    customerName: 'Maseru Business Association',
    phone: '+266 5891 2233',
    purpose: 'Business Meeting',
    description: 'Quarterly business networking meeting.',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'M-Pesa',
    paymentReference: 'MPX912845',
  },

  {
    id: 'TRC-003',
    date: '2026-09-18',
    startTime: '09:00',
    endTime: '12:00',
    customerName: 'Sarah Khatleli',
    phone: '+266 6255 8821',
    purpose: 'Workshop',
    description: 'Small business training workshop.',
    status: 'pending',
    paymentStatus: 'pending',
  },

  {
    id: 'TRC-004',
    date: '2026-09-19',
    startTime: '12:00',
    endTime: '16:00',
    customerName: 'Thabo Events',
    phone: '+266 5911 7742',
    purpose: 'Birthday Celebration',
    description: 'Private birthday celebration.',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'M-Pesa',
    paymentReference: 'MPX661203',
  },
];

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
