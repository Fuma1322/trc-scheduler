'use client';

import { useMemo, useState } from 'react';

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
  status: 'PENDING' | 'PAID' | 'REJECTED' | 'CANCELLED';
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

const initialCustomers: Customer[] = [
  {
    id: 'cus-001',
    name: 'Mpho Mokoena',
    phone: '+266 5912 3456',
    whatsapp: '+266 5912 3456',
    email: 'mpho@example.com',
    totalBookings: 3,
    totalSpent: 10500,
    lastBooking: '2026-09-24',
    createdAt: '2026-04-12',
    bookings: [
      {
        id: 'b-001',
        reference: 'TRC-2026-0148',
        purpose: 'Wedding',
        date: '2026-09-24',
        time: '10:00 - 16:00',
        amount: 5000,
        status: 'PAID',
      },
      {
        id: 'b-002',
        reference: 'TRC-2026-0091',
        purpose: 'Meeting',
        date: '2026-07-18',
        time: '10:00 - 12:00',
        amount: 1500,
        status: 'PAID',
      },
      {
        id: 'b-003',
        reference: 'TRC-2026-0064',
        purpose: 'Workshop',
        date: '2026-06-09',
        time: '08:00 - 12:00',
        amount: 4000,
        status: 'PAID',
      },
    ],
  },
  {
    id: 'cus-002',
    name: 'Thabiso Molapo',
    phone: '+266 6334 7821',
    whatsapp: '+266 6334 7821',
    email: 'thabiso@example.com',
    totalBookings: 2,
    totalSpent: 5500,
    lastBooking: '2026-09-26',
    createdAt: '2026-05-21',
    bookings: [
      {
        id: 'b-004',
        reference: 'TRC-2026-0149',
        purpose: 'Workshop',
        date: '2026-09-26',
        time: '08:00 - 13:00',
        amount: 2500,
        status: 'PAID',
      },
      {
        id: 'b-005',
        reference: 'TRC-2026-0103',
        purpose: 'Meeting',
        date: '2026-08-02',
        time: '09:00 - 12:00',
        amount: 3000,
        status: 'PAID',
      },
    ],
  },
  {
    id: 'cus-003',
    name: 'Lerato Nthunya',
    phone: '+266 5891 2345',
    whatsapp: '+266 5891 2345',
    email: 'lerato@example.com',
    totalBookings: 1,
    totalSpent: 0,
    lastBooking: '2026-09-27',
    createdAt: '2026-09-10',
    bookings: [
      {
        id: 'b-006',
        reference: 'TRC-2026-0150',
        purpose: 'Birthday',
        date: '2026-09-27',
        time: '14:00 - 18:00',
        amount: 3000,
        status: 'PENDING',
      },
    ],
  },
  {
    id: 'cus-004',
    name: 'Kabelo Phiri',
    phone: '+266 6212 9981',
    whatsapp: '+266 6212 9981',
    email: 'kabelo@example.com',
    totalBookings: 1,
    totalSpent: 0,
    lastBooking: '2026-09-29',
    createdAt: '2026-09-14',
    bookings: [
      {
        id: 'b-007',
        reference: 'TRC-2026-0151',
        purpose: 'Meeting',
        date: '2026-09-29',
        time: '09:00 - 12:00',
        amount: 1500,
        status: 'PENDING',
      },
    ],
  },
  {
    id: 'cus-005',
    name: 'Masechaba Raleche',
    phone: '+266 5845 2217',
    whatsapp: '+266 5845 2217',
    email: 'masechaba@example.com',
    totalBookings: 1,
    totalSpent: 0,
    lastBooking: '2026-09-30',
    createdAt: '2026-09-15',
    bookings: [
      {
        id: 'b-008',
        reference: 'TRC-2026-0152',
        purpose: 'Funeral',
        date: '2026-09-30',
        time: '08:00 - 14:00',
        amount: 4000,
        status: 'REJECTED',
      },
    ],
  },
  {
    id: 'cus-006',
    name: 'Neo Matete',
    phone: '+266 5978 4412',
    whatsapp: '+266 5978 4412',
    email: 'neo@example.com',
    totalBookings: 1,
    totalSpent: 0,
    lastBooking: '2026-10-02',
    createdAt: '2026-09-18',
    bookings: [
      {
        id: 'b-009',
        reference: 'TRC-2026-0153',
        purpose: 'Workshop',
        date: '2026-10-02',
        time: '10:00 - 15:00',
        amount: 2500,
        status: 'PENDING',
      },
    ],
  },
];

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(initialCustomers);

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.whatsapp.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const totalRevenue = customers.reduce((total, customer) => total + customer.totalSpent, 0);

  const repeatCustomers = customers.filter((customer) => customer.totalBookings > 1).length;

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
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

              <p className="mt-1 text-xl font-bold text-[#064E3B]">{customers.length}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Customers
            </p>

            <p className="mt-2 text-2xl font-bold text-[#17201C]">{customers.length}</p>

            <p className="mt-1 text-xs text-[#66736C]">Registered customers</p>
          </div>

          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Repeat Customers
            </p>

            <p className="mt-2 text-2xl font-bold text-[#047857]">{repeatCustomers}</p>

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

        {/* Customer list */}
        <div className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <CustomerFilters search={search} onSearchChange={setSearch} />

          <CustomerTable customers={filteredCustomers} onSelectCustomer={setSelectedCustomer} />
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
