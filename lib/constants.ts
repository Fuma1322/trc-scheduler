export const ACTIVITIES = [
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'Weddings and wedding receptions',
    icon: 'Heart',
  },
  {
    id: 'meeting',
    name: 'Meeting',
    description: 'Business and community meetings',
    icon: 'Users',
  },
  {
    id: 'workshop',
    name: 'Workshop',
    description: 'Training and educational events',
    icon: 'GraduationCap',
  },
  {
    id: 'funeral',
    name: 'Funeral',
    description: 'Funeral and memorial gatherings',
    icon: 'Flower2',
  },
  {
    id: 'birthday',
    name: 'Birthday',
    description: 'Birthday and private celebrations',
    icon: 'Cake',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Another type of event',
    icon: 'Sparkles',
  },
] as const;

export const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
] as const;

export const HALL_NAME = 'TRC Hall';

export const BOOKING_FEE = 500;

export const MPESA_MERCHANT_NUMBER = '123456';