export const ACTIVITIES = [
  {
    id: 'press-conference',
    name: 'Press Conference',
    description: 'Media events and press conferences',
    icon: 'MicVocal',
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

export const BOOKING_DURATIONS = [
  {
    id: 'full-day',
    name: 'Full Day',
    description: 'Book the hall for the entire day',
  },
  {
    id: 'half-day',
    name: 'Half Day',
    description: 'Book the hall for a morning or afternoon session',
  },
  {
    id: 'custom',
    name: 'Custom Hours',
    description: 'Choose your own start and end time',
  },
] as const;

export const HALF_DAY_SLOTS = [
  {
    id: 'morning',
    name: 'Morning',
    time: '08:00 - 13:00',
  },
  {
    id: 'afternoon',
    name: 'Afternoon',
    time: '13:00 - 18:00',
  },
] as const;

export const BOOKING_HOURS = [
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
] as const;

export const HALL_NAME = 'TRC Hall';

export const BOOKING_FEE = 500;

export const MPESA_MERCHANT_NUMBER = '123456';
