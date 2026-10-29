
'use client';

import { useEffect, useMemo, useState } from 'react';

import CustomerFilters from './CustomerFilters';
import CustomerTable from './CustomerTable';
import CustomerDetailsModal from './CustomerDetailsModal';

export type CustomerBooking = {
  id: string;
  reference: string;
  purpose: string;
  date: string;
  time: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  createdAt: string;
  bookings: CustomerBooking[];
};

type ApiCustomer = Omit<Partial<Customer>, 'bookings'> & {
  id?: string;
  name?: string;
  bookings?: Array<
    Partial<CustomerBooking> & {
      dates?: string[];
      startTime?: string;
      endTime?: string;
      paymentStatus?: string;
    }
  >;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

function mapCustomer(item: ApiCustomer): Customer {
  const bookings: CustomerBooking[] = (item.bookings ?? []).map((booking) => ({
    id: booking.id || '',
    reference: booking.reference || 'No reference',
    purpose: booking.purpose || 'Other',
    date: booking.date || booking.dates?.[0] || '',
    time:
      booking.time ||
      [booking.startTime, booking.endTime].filter(Boolean).join(' - ') ||
      'Not specified',
    amount:
      typeof booking.amount === 'number' && Number.isFinite(booking.amount)
        ? booking.amount
        : 0,
    status: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(
      booking.status || '',
    )
      ? (booking.status as CustomerBooking['status'])
      : 'PENDING',
  }));

  return {
    id: item.id || '',
    name: item.name || 'Unknown customer',
    phone: item.phone || '',
    whatsapp: item.whatsapp || item.phone || '',
    email: item.email || '',
    totalBookings:
      typeof item.totalBookings === 'number'
        ? item.totalBookings
        : bookings.length,
    totalSpent:
      typeof item.totalSpent === 'number' ? item.totalSpent : 0,
    lastBooking: item.lastBooking || '',
    createdAt: item.createdAt || '',
    bookings,
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCustomers() {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('trc_admin_token');

        if (!token) {
          throw new Error('Your admin session is missing. Please sign in again.');
        }

        const response = await fetch(`${API_URL}/api/admin/customers`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const body = await response.json().catch(() => ({}));

        if (!response.ok || body.success !== true || !Array.isArray(body.data)) {
          throw new Error(body.message || 'Could not load customers.');
        }

        setCustomers(body.data.map(mapCustomer));
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        setError(
          err instanceof Error ? err.message : 'Could not load customers.',
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCustomers();
    return () => controller.abort();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.phone,
        customer.whatsapp,
        customer.email,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [customers, search]);

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0,
  );

  const repeatCustomers = customers.filter(
    (customer) => customer.totalBookings > 1,
  ).length;

  return (
    <>
      <div className="space-y-8">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
                Customer Management
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#17201C] sm:text-3xl">
                Customers
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66736C]">
                View customer information, booking history, and spending activity.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DDE8E1] bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Total Customers
              </p>
              <p className="mt-1 text-xl font-bold text-[#064E3B]">
                {customers.length}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Customers
            </p>
            <p className="mt-2 text-2xl font-bold text-[#17201C]">
              {customers.length}
            </p>
            <p className="mt-1 text-xs text-[#66736C]">Registered customers</p>
          </div>

          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Repeat Customers
            </p>
            <p className="mt-2 text-2xl font-bold text-[#047857]">
              {repeatCustomers}
            </p>
            <p className="mt-1 text-xs text-[#66736C]">More than one booking</p>
          </div>

          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Customer Revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-[#17201C]">
              M{totalRevenue.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#66736C]">From paid bookings</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <CustomerFilters search={search} onSearchChange={setSearch} />

          {loading ? (
            <div className="p-10 text-center text-sm text-[#66736C]">
              Loading customers...
            </div>
          ) : (
            <CustomerTable
              customers={filteredCustomers}
              onSelectCustomer={setSelectedCustomer}
            />
          )}
        </div>
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </>
  );
}
