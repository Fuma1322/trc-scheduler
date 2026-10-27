
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Users2,
  RefreshCw,
} from 'lucide-react';

type DashboardStats = {
  totalBookings: number;
  pendingBookings: number;
  paidPayments: number;
  pendingPayments: number;
  totalCustomers: number;
};

type UpcomingBooking = {
  id?: string;
  reference?: string;
  customerName?: string;
  purpose?: string;
  dates?: string[];
  date?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  status?: string;
  paymentStatus?: string;
};

type DashboardResponse = {
  success: boolean;
  message?: string;
  data?: {
    stats: DashboardStats;
    upcomingBookings: UpcomingBooking[];
  };
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const numberFormat = new Intl.NumberFormat();

function displayDate(booking: UpcomingBooking) {
  const date = booking.dates?.[0] ?? booking.date;
  if (!date) return 'Date not specified';

  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function displayTime(booking: UpcomingBooking) {
  if (booking.time) return booking.time;
  if (booking.startTime && booking.endTime) {
    return `${booking.startTime} – ${booking.endTime}`;
  }
  return 'Time not specified';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('trc_admin_token');

      if (!token) {
        throw new Error('Your admin session is missing. Please sign in again.');
      }

      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      const result = (await response.json()) as DashboardResponse;

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('trc_admin_token');
        localStorage.removeItem('trc_admin');
        throw new Error('Your session has expired. Please sign in again.');
      }

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || 'Could not load dashboard data.');
      }

      setStats(result.data.stats);
      setUpcomingBookings(result.data.upcomingBookings ?? []);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Unable to connect to the API. Check that the backend is running on port 5000.'
          : err instanceof Error
            ? err.message
            : 'Something went wrong while loading the dashboard.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats?.totalBookings,
      description: 'All booking requests',
      icon: CalendarDays,
    },
    {
      label: 'Pending Bookings',
      value: stats?.pendingBookings,
      description: 'Awaiting a decision',
      icon: Clock3,
    },
    {
      label: 'Paid Payments',
      value: stats?.paidPayments,
      description: 'Payments verified',
      icon: CheckCircle2,
    },
    {
      label: 'Customers',
      value: stats?.totalCustomers,
      description: 'Unique customers',
      icon: Users2,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857]">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17201C]">
            Good day, Administrator.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#7A8580]">
            Here is what&apos;s happening with the TRC Hall.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#E4E9E4] bg-white px-3.5 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span className="text-xs font-medium text-[#53605A]">
              Connected to dashboard API
            </span>
          </div>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            aria-label="Refresh dashboard"
            className="rounded-xl border border-[#E4E9E4] bg-white p-2.5 text-[#047857] hover:bg-[#F7FCF9] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>
          <div className="flex gap-3">
            {error.toLowerCase().includes('sign in') && (
              <a className="font-semibold underline" href="/login">
                Sign in
              </a>
            )}
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-[0_6px_25px_rgba(6,78,59,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(6,78,59,0.07)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                  <Icon size={19} strokeWidth={1.8} />
                </div>
                <ArrowUpRight size={16} className="text-[#B1BBB6]" />
              </div>
              <p className="mt-5 text-2xl font-bold tracking-tight text-[#17201C]">
                {loading && !stats
                  ? '—'
                  : numberFormat.format(stat.value ?? 0)}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#53605A]">
                {stat.label}
              </p>
              <p className="mt-1 text-[10px] text-[#9AA49F]">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#FDE7C2] bg-[#FFFBF4] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#B45309]">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#17201C]">
                {loading && !stats
                  ? 'Checking pending payments…'
                  : `${numberFormat.format(stats?.pendingPayments ?? 0)} payments need verification`}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#7A8580]">
                Review submitted payments before marking them as paid.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/payments"
            className="inline-flex items-center justify-center rounded-xl bg-[#064E3B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#053F30]"
          >
            Review payments
          </a>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[#E4E9E4] bg-white">
          <div className="flex items-center justify-between border-b border-[#E8ECE9] px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-bold text-[#17201C]">
                Upcoming bookings
              </p>
              <p className="mt-1 text-[10px] text-[#9AA49F]">
                Booking records returned by the backend
              </p>
            </div>
            <a
              href="/dashboard/bookings"
              className="text-[11px] font-semibold text-[#047857] hover:underline"
            >
              View all
            </a>
          </div>

          {loading && upcomingBookings.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[#7A8580]">
              Loading bookings…
            </p>
          ) : upcomingBookings.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[#7A8580]">
              No upcoming bookings were returned.
            </p>
          ) : (
            <div className="divide-y divide-[#EEF1EF]">
              {upcomingBookings.map((booking, index) => {
                const isApproved = booking.status === 'APPROVED';
                const name = booking.customerName || 'Customer';

                return (
                  <div
                    key={booking.id || booking.reference || `${name}-${index}`}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#26332D]">
                        {name}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8A958F]">
                        {booking.purpose || 'Booking'} · {displayDate(booking)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-medium text-[#66736C]">
                        {displayTime(booking)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          isApproved
                            ? 'bg-[#ECFDF5] text-[#047857]'
                            : 'bg-[#FFF7E8] text-[#B45309]'
                        }`}
                      >
                        {booking.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-6">
          <p className="text-sm font-bold text-[#17201C]">Quick actions</p>
          <p className="mt-1 text-[10px] text-[#9AA49F]">
            Common administration tasks
          </p>

          <div className="mt-5 space-y-2.5">
            <a
              href="/dashboard/payments"
              className="flex items-center justify-between rounded-xl border border-[#E4E9E4] px-4 py-3 transition hover:border-[#A7F3D0] hover:bg-[#F7FCF9]"
            >
              <span className="text-xs font-semibold text-[#53605A]">
                Review pending payments
              </span>
              <ArrowUpRight size={15} className="text-[#047857]" />
            </a>
            <a
              href="/calendar"
              className="flex items-center justify-between rounded-xl border border-[#E4E9E4] px-4 py-3 transition hover:border-[#A7F3D0] hover:bg-[#F7FCF9]"
            >
              <span className="text-xs font-semibold text-[#53605A]">
                View public calendar
              </span>
              <ArrowUpRight size={15} className="text-[#047857]" />
            </a>
            <a
              href="/dashboard/bookings"
              className="flex items-center justify-between rounded-xl border border-[#E4E9E4] px-4 py-3 transition hover:border-[#A7F3D0] hover:bg-[#F7FCF9]"
            >
              <span className="text-xs font-semibold text-[#53605A]">
                Manage bookings
              </span>
              <ArrowUpRight size={15} className="text-[#047857]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
