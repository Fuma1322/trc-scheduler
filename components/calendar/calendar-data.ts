export type SlotStatus = 'available' | 'booked';

export type DayAvailability = {
  date: string;
  status: 'available' | 'limited' | 'full';
  slots: {
    time: string;
    status: SlotStatus;
  }[];
};

export const availability: DayAvailability[] = [
  {
    date: '2026-09-22',
    status: 'available',
    slots: [
      { time: '08:00', status: 'available' },
      { time: '09:00', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '11:00', status: 'available' },
      { time: '12:00', status: 'available' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'available' },
      { time: '15:00', status: 'available' },
      { time: '16:00', status: 'available' },
    ],
  },

  {
    date: '2026-09-23',
    status: 'limited',
    slots: [
      { time: '08:00', status: 'available' },
      { time: '09:00', status: 'booked' },
      { time: '10:00', status: 'booked' },
      { time: '11:00', status: 'available' },
      { time: '12:00', status: 'booked' },
      { time: '13:00', status: 'available' },
      { time: '14:00', status: 'booked' },
      { time: '15:00', status: 'available' },
      { time: '16:00', status: 'available' },
    ],
  },

  {
    date: '2026-09-24',
    status: 'full',
    slots: [
      { time: '08:00', status: 'booked' },
      { time: '09:00', status: 'booked' },
      { time: '10:00', status: 'booked' },
      { time: '11:00', status: 'booked' },
      { time: '12:00', status: 'booked' },
      { time: '13:00', status: 'booked' },
      { time: '14:00', status: 'booked' },
      { time: '15:00', status: 'booked' },
      { time: '16:00', status: 'booked' },
    ],
  },

  {
    date: '2026-09-25',
    status: 'available',
    slots: [
      { time: '08:00', status: 'available' },
      { time: '09:00', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '11:00', status: 'available' },
      { time: '12:00', status: 'available' },
      { time: '13:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '15:00', status: 'available' },
      { time: '16:00', status: 'available' },
    ],
  },

  {
    date: '2026-09-26',
    status: 'limited',
    slots: [
      { time: '08:00', status: 'available' },
      { time: '09:00', status: 'available' },
      { time: '10:00', status: 'booked' },
      { time: '11:00', status: 'booked' },
      { time: '12:00', status: 'available' },
      { time: '13:00', status: 'available' },
      { time: '14:00', status: 'booked' },
      { time: '15:00', status: 'available' },
      { time: '16:00', status: 'available' },
    ],
  },

  {
    date: '2026-09-27',
    status: 'available',
    slots: [
      { time: '08:00', status: 'available' },
      { time: '09:00', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '11:00', status: 'available' },
      { time: '12:00', status: 'available' },
      { time: '13:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '15:00', status: 'available' },
      { time: '16:00', status: 'available' },
    ],
  },
];
