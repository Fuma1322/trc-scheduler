'use client';

import { CalendarDays, Check, Clock3, Mail, Phone, User, X } from 'lucide-react';

import type { Customer } from './CustomersPage';

type Props = {
  customer: Customer;
  onClose: () => void;
};

const statusStyles = {
  PENDING: 'bg-[#FFF7E8] text-[#B45309]',
  PAID: 'bg-[#ECFDF5] text-[#047857]',
  REJECTED: 'bg-[#FEF2F2] text-[#B91C1C]',
  CANCELLED: 'bg-[#F3F4F3] text-[#69736E]',
};

export default function CustomerDetailsModal({ customer, onClose }: Props) {
  const initials = customer.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#17201C]/35 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_24px_80px_rgba(6,78,59,0.18)] sm:max-h-[90vh] sm:rounded-[28px]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#E4E9E4] px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] font-bold text-[#047857]">
                {initials}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A958F]">
                  Customer Profile
                </p>

                <h2 className="mt-1 text-lg font-bold tracking-tight text-[#17201C]">
                  {customer.name}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#66736C] transition hover:bg-[#F3F6F3] hover:text-[#17201C]"
              aria-label="Close customer details"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-6 sm:px-7">
          {/* Customer info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E4E9E4] p-4">
              <div className="flex items-center gap-2 text-[#047857]">
                <Phone size={16} />
                <span className="text-xs font-semibold uppercase tracking-[0.1em]">Phone</span>
              </div>

              <p className="mt-3 text-sm font-semibold text-[#17201C]">{customer.phone}</p>
            </div>

            <div className="rounded-2xl border border-[#E4E9E4] p-4">
              <div className="flex items-center gap-2 text-[#047857]">
                <Mail size={16} />
                <span className="text-xs font-semibold uppercase tracking-[0.1em]">Email</span>
              </div>

              <p className="mt-3 break-all text-sm font-semibold text-[#17201C]">
                {customer.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#F7F8F5] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Bookings
              </p>

              <p className="mt-2 text-xl font-bold text-[#17201C]">{customer.totalBookings}</p>
            </div>

            <div className="rounded-2xl bg-[#F7F8F5] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Total Spent
              </p>

              <p className="mt-2 text-xl font-bold text-[#047857]">
                M{customer.totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 rounded-2xl bg-[#F7F8F5] p-4 sm:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Customer Since
              </p>

              <p className="mt-2 text-xl font-bold text-[#17201C]">{customer.createdAt}</p>
            </div>
          </div>

          {/* Booking history */}
          <section className="mt-7">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays size={17} className="text-[#047857]" strokeWidth={1.8} />

              <h3 className="text-sm font-bold text-[#17201C]">Booking History</h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E4E9E4]">
              {customer.bookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className={`p-4 ${
                    index !== customer.bookings.length - 1 ? 'border-b border-[#E4E9E4]' : ''
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#17201C]">{booking.purpose}</p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#8A958F]">{booking.reference}</p>
                    </div>

                    <p className="text-sm font-bold text-[#17201C]">
                      M{booking.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#66736C]">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {booking.date}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={13} />
                      {booking.time}
                    </span>

                    {booking.status === 'PAID' && (
                      <span className="flex items-center gap-1.5 text-[#047857]">
                        <Check size={13} />
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E4E9E4] px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#17201C] px-5 text-sm font-semibold text-white transition hover:bg-[#064E3B]"
          >
            <User size={16} />
            Close Customer Profile
          </button>
        </div>
      </div>
    </div>
  );
}
