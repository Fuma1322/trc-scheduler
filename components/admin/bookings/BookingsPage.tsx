'use client';

import { useMemo, useState } from 'react';

import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import BookingDetailsModal from './BookingDetailsModal';

export type BookingStatus = 'PENDING' | 'PAID' | 'REJECTED' | 'CANCELLED';

export type Booking = {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  purpose: string;
  date: string;
  time: string;
  amount: number;
  paymentReference: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

const initialBookings: Booking[] = [
  {
    id: '1',
    reference: 'TRC-2026-0148',
    customerName: 'Mpho Mokoena',
    phone: '+266 5812 3456',
    whatsapp: '+266 5812 3456',
    purpose: 'Wedding',
    date: '2026-09-24',
    time: '10:00 – 16:00',
    amount: 5000,
    paymentReference: 'MPESA784521',
    notes: 'Wedding reception for approximately 120 guests.',
    status: 'PAID',
    createdAt: '2026-09-18',
  },

  {
    id: '2',
    reference: 'TRC-2026-0149',
    customerName: 'Thabiso Molapo',
    phone: '+266 5891 2271',
    whatsapp: '+266 5891 2271',
    purpose: 'Workshop',
    date: '2026-09-26',
    time: '08:00 – 13:00',
    amount: 2500,
    paymentReference: 'MPESA912834',
    notes: 'Training workshop.',
    status: 'PAID',
    createdAt: '2026-09-19',
  },

  {
    id: '3',
    reference: 'TRC-2026-0150',
    customerName: 'Lerato Nthunya',
    phone: '+266 6312 8841',
    whatsapp: '+266 6312 8841',
    purpose: 'Birthday',
    date: '2026-09-27',
    time: '14:00 – 18:00',
    amount: 3000,
    paymentReference: 'MPESA663921',
    notes: 'Private birthday celebration.',
    status: 'PENDING',
    createdAt: '2026-09-20',
  },

  {
    id: '4',
    reference: 'TRC-2026-0151',
    customerName: 'Kabelo Phiri',
    phone: '+266 5921 4421',
    whatsapp: '+266 5921 4421',
    purpose: 'Meeting',
    date: '2026-09-29',
    time: '09:00 – 12:00',
    amount: 1500,
    paymentReference: 'MPESA118234',
    notes: 'Community organisation meeting.',
    status: 'PENDING',
    createdAt: '2026-09-21',
  },

  {
    id: '5',
    reference: 'TRC-2026-0152',
    customerName: 'Masechaba Raleche',
    phone: '+266 5811 9023',
    whatsapp: '+266 5811 9023',
    purpose: 'Funeral',
    date: '2026-09-30',
    time: '08:00 – 14:00',
    amount: 4000,
    paymentReference: 'MPESA000812',
    notes: '',
    status: 'REJECTED',
    createdAt: '2026-09-21',
  },

  {
    id: '6',
    reference: 'TRC-2026-0153',
    customerName: 'Neo Matete',
    phone: '+266 6201 7722',
    whatsapp: '+266 6201 7722',
    purpose: 'Workshop',
    date: '2026-10-02',
    time: '10:00 – 15:00',
    amount: 2500,
    paymentReference: 'MPESA882341',
    notes: 'Youth training programme.',
    status: 'PENDING',
    createdAt: '2026-09-22',
  },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');

  const [search, setSearch] = useState('');

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;

      const matchesSearch =
        !query ||
        booking.customerName.toLowerCase().includes(query) ||
        booking.reference.toLowerCase().includes(query) ||
        booking.purpose.toLowerCase().includes(query) ||
        booking.paymentReference.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status,
            }
          : booking
      )
    );

    setSelectedBooking((current) =>
      current && current.id === id
        ? {
            ...current,
            status,
          }
        : current
    );
  };

  const counts = {
    all: bookings.length,

    pending: bookings.filter((booking) => booking.status === 'PENDING').length,

    paid: bookings.filter((booking) => booking.status === 'PAID').length,

    rejected: bookings.filter((booking) => booking.status === 'REJECTED').length,

    cancelled: bookings.filter((booking) => booking.status === 'CANCELLED').length,
  };

  return (
    <>
      <div className="space-y-7">
        {/* HEADER */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857]">
            Management
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#17201C]">Bookings</h1>

              <p className="mt-1.5 text-sm text-[#7A8580]">
                Review, verify and manage TRC Hall bookings.
              </p>
            </div>

            <div className="text-xs text-[#8A958F]">{counts.all} total bookings</div>
          </div>
        </div>

        {/* FILTERS */}
        <BookingFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          counts={counts}
        />

        {/* TABLE */}
        <BookingTable bookings={filteredBookings} onSelect={setSelectedBooking} />
      </div>

      {/* MODAL */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateBookingStatus}
        />
      )}
    </>
  );
}
