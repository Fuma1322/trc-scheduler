'use client';

import { useEffect, useMemo, useState } from 'react';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import BookingDetailsModal from './BookingDetailsModal';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

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

type ApiBooking = {
  id?: string;
  reference?: string;
  customerName?: string;
  phone?: string;
  whatsapp?: string;
  purpose?: string;
  date?: string;
  dates?: string[];
  time?: string;
  startTime?: string;
  endTime?: string;
  amount?: number | null;
  paymentReference?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const validStatuses: BookingStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
];

function mapBooking(item: ApiBooking): Booking {
  const status = validStatuses.includes(item.status as BookingStatus)
    ? (item.status as BookingStatus)
    : 'PENDING';

  return {
    id: item.id || '',
    reference: item.reference || 'No reference',
    customerName: item.customerName || 'Unknown customer',
    phone: item.phone || '',
    whatsapp: item.whatsapp || item.phone || '',
    purpose: item.purpose || 'Other',
    date: item.date || item.dates?.[0] || '',
    time:
      item.time ||
      [item.startTime, item.endTime].filter(Boolean).join(' - ') ||
      'Not specified',
    amount:
      typeof item.amount === 'number' && Number.isFinite(item.amount)
        ? item.amount
        : 0,
    paymentReference: item.paymentReference || '',
    notes: item.notes || '',
    status,
    createdAt: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : 'Unknown',
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('trc_admin_token');
        if (!token) {
          throw new Error('Your admin session is missing. Please sign in again.');
        }

        const response = await fetch(`${API_URL}/api/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store',
        });
        const body = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
          throw new Error('Your admin session has expired. Please sign in again.');
        }
        if (!response.ok || body.success !== true || !Array.isArray(body.data)) {
          throw new Error(body.message || 'Could not load bookings.');
        }

        setBookings(body.data.map(mapBooking));
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Could not load bookings.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadBookings();
    return () => controller.abort();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === 'ALL' || booking.status === statusFilter;
      const matchesSearch =
        !query ||
        booking.customerName.toLowerCase().includes(query) ||
        booking.reference.toLowerCase().includes(query) ||
        booking.purpose.toLowerCase().includes(query) ||
        booking.paymentReference.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    if (updatingId) return;

    setUpdatingId(id);
    setError('');
    setNotice('');

    try {
      const token = localStorage.getItem('trc_admin_token');
      if (!token) {
        throw new Error('Your admin session is missing. Please sign in again.');
      }

      const response = await fetch(
        `${API_URL}/api/admin/bookings/${encodeURIComponent(id)}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        },
      );
      const body = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error('Your admin session has expired. Please sign in again.');
      }
      if (!response.ok || body.success !== true) {
        throw new Error(body.message || 'Could not update booking status.');
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, status } : booking,
        ),
      );
      setSelectedBooking((current) =>
        current && current.id === id ? { ...current, status } : current,
      );
      setNotice(`Booking status updated to ${status.toLowerCase()}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update booking.');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter((booking) => booking.status === 'PENDING').length,
    approved: bookings.filter((booking) => booking.status === 'APPROVED').length,
    rejected: bookings.filter((booking) => booking.status === 'REJECTED').length,
    cancelled: bookings.filter((booking) => booking.status === 'CANCELLED').length,
    paid: bookings.filter((booking) => booking.amount > 0).length,
  };

  return (
    <>
      <div className="space-y-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857]">
            Management
          </p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#17201C]">
                Bookings
              </h1>
              <p className="mt-1.5 text-sm text-[#7A8580]">
                Review and manage TRC Hall bookings. Payment verification is handled separately.
              </p>
            </div>
            <div className="text-xs text-[#8A958F]">
              {counts.all} total bookings
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        <BookingFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          counts={counts}
        />

        {loading ? (
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-12 text-center text-sm text-[#66736C]">
            Loading bookings...
          </div>
        ) : (
          <BookingTable bookings={filteredBookings} onSelect={setSelectedBooking} />
        )}
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateBookingStatus}
        />
      )}

      {updatingId && (
        <p className="sr-only" role="status">Saving booking status...</p>
      )}
    </>
  );
}
