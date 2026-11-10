'use client';

import { useEffect, useMemo, useState } from 'react';

import CalendarHeader from './CalendarHeader';
import DateStrip from './DateStrip';
import TimeGrid from './TimeGrid';
import BookingModal from './BookingModal';

import type { Booking } from '../../../lib/calendar-data';

type ApiBooking = {
  id: string;
  reference?: string;
  customerName?: string;
  phone?: string;
  purpose?: string;
  activity?: string;
  notes?: string;
  dates?: string[];
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentReference?: string;
};

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function toBooking(record: ApiBooking, date: string): Booking {
  const status = (record.status || '').toUpperCase();
  const paymentStatus = (record.paymentStatus || '').toUpperCase();

  return {
    id: record.id,
    date,
    startTime: record.startTime || '08:00',
    endTime: record.endTime || '09:00',
    customerName: record.customerName || 'Customer',
    phone: record.phone || '',
    purpose: record.purpose || record.activity || 'Hall booking',
    description: record.notes || undefined,
    status: ['REJECTED', 'CANCELLED'].includes(status)
      ? 'cancelled'
      : ['CONFIRMED', 'APPROVED'].includes(status)
        ? 'confirmed'
        : 'pending',
    paymentStatus: ['PAID', 'VERIFIED', 'COMPLETED'].includes(paymentStatus)
      ? 'paid'
      : 'pending',
    paymentMethod: record.paymentMethod,
    paymentReference: record.paymentReference,
  };
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const start = formatDate(days[0]);
  const end = formatDate(days[6]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      setLoading(true);
      setError('');
      setBookings([]);

      try {
        const token = localStorage.getItem('trc_admin_token');
        if (!token) throw new Error('Your admin session is missing. Please sign in again.');

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
          .replace(/\/+$/, '');

        const response = await fetch(
          `${baseUrl}/api/admin/calendar?start=${start}&end=${end}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          throw new Error('Your admin session is expired or does not have calendar access. Please sign in again.');
        }

        if (!response.ok || result.success !== true) {
          throw new Error(result.message || 'Unable to load calendar bookings.');
        }

        const records: ApiBooking[] = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.bookings)
            ? result.data.bookings
            : [];

        const entries = records.flatMap((record) => {
          const recordDates = Array.isArray(record.dates) && record.dates.length
            ? record.dates
            : record.date
              ? [record.date]
              : [];

          return recordDates
            .filter((date) => date >= start && date <= end)
            .map((date) => toBooking(record, date));
        });

        setBookings(entries);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Unable to load calendar bookings.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadBookings();
    return () => controller.abort();
  }, [start, end]);

  const monthLabel = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <section className="overflow-hidden rounded-[22px] border border-[#E5EAE6] bg-white shadow-[0_8px_35px_rgba(6,78,59,0.05)]">
        <CalendarHeader
          monthLabel={monthLabel}
          onPrevious={() => setSelectedDate((date) => addDays(date, -7))}
          onNext={() => setSelectedDate((date) => addDays(date, 7))}
          onToday={() => setSelectedDate(new Date())}
        />

        {loading && (
          <p role="status" className="px-5 py-3 text-sm text-[#718079]">
            Loading bookings…
          </p>
        )}

        {error && (
          <div role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <DateStrip
              days={days.map((date) => ({
                date,
                isToday: date.toDateString() === new Date().toDateString(),
                isSelected: date.toDateString() === selectedDate.toDateString(),
              }))}
            />
          </div>
        </div>

        {!loading && !error && bookings.length === 0 && (
          <p className="px-5 py-3 text-sm text-[#718079]">
            No bookings found for this week.
          </p>
        )}

        <TimeGrid days={days} bookings={bookings} onBookingClick={setSelectedBooking} />
      </section>

      <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </>
  );
}
