'use client';

import { CalendarDays, ChevronRight, Phone, User } from 'lucide-react';

import type { Customer } from './CustomersPage';

type Props = {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
};

export default function CustomerTable({ customers, onSelectCustomer }: Props) {
  if (customers.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#047857]">
          <User size={21} strokeWidth={1.8} />
        </div>

        <h3 className="mt-4 text-sm font-bold text-[#17201C]">No customers found</h3>

        <p className="mt-1 max-w-sm text-sm text-[#66736C]">
          Try adjusting your search to find the customer you are looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-[#E4E9E4] bg-[#FAFBFA] text-left">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Customer
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Contact
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Bookings
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Total Spent
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Last Booking
              </th>

              <th className="px-6 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E4E9E4]">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onSelectCustomer(customer)}
                className="cursor-pointer transition hover:bg-[#FAFCFA]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-sm font-bold text-[#047857]">
                      {customer.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#17201C]">{customer.name}</p>

                      <p className="mt-0.5 text-xs text-[#8A958F]">
                        Customer since {customer.createdAt}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-[#66736C]">
                    <Phone size={14} />
                    {customer.phone}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-[#F0F5F1] px-2.5 py-1 text-xs font-semibold text-[#047857]">
                    {customer.totalBookings}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-[#17201C]">
                  M{customer.totalSpent.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-sm text-[#66736C]">{customer.lastBooking}</td>

                <td className="px-6 py-4">
                  <ChevronRight size={18} className="text-[#A0AAA4]" strokeWidth={1.8} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-[#E4E9E4] md:hidden">
        {customers.map((customer) => (
          <button
            key={customer.id}
            type="button"
            onClick={() => onSelectCustomer(customer)}
            className="flex w-full items-center gap-4 p-4 text-left transition active:bg-[#FAFCFA]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-sm font-bold text-[#047857]">
              {customer.name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#17201C]">{customer.name}</p>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#8A958F]">
                <span className="flex items-center gap-1">
                  <CalendarDays size={13} />
                  {customer.totalBookings} booking
                  {customer.totalBookings !== 1 ? 's' : ''}
                </span>

                <span>M{customer.totalSpent.toLocaleString()}</span>
              </div>
            </div>

            <ChevronRight size={18} className="shrink-0 text-[#A0AAA4]" strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </>
  );
}
