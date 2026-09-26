'use client';

import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';

import type { Booking } from './BookingsPage';

type Props = {
  bookings: Booking[];
  onSelect: (booking: Booking) => void;
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const styles = {
    PENDING: 'bg-[#FFF7E8] text-[#B45309]',
    PAID: 'bg-[#ECFDF5] text-[#047857]',
    REJECTED: 'bg-[#FEF2F2] text-[#B91C1C]',
    CANCELLED: 'bg-[#F3F4F3] text-[#69736E]',
  };

  const labels = {
    PENDING: 'Pending',
    PAID: 'Paid',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function BookingTable({ bookings, onSelect }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E4E9E4] bg-white p-12 text-center">
        <CalendarDays size={24} className="mx-auto text-[#A3ADA8]" />

        <h3 className="mt-4 text-sm font-semibold text-[#53605A]">No bookings found</h3>

        <p className="mt-1 text-xs text-[#9AA49F]">Try changing your search or status filter.</p>
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#E4E9E4] bg-white shadow-[0_6px_25px_rgba(6,78,59,0.03)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-[#E7ECE9] bg-[#FAFBF9]">
                <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-[#929D97]">
                  Customer
                </th>

                <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-[#929D97]">
                  Date & Time
                </th>

                <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-[#929D97]">
                  Purpose
                </th>

                <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-[#929D97]">
                  Payment
                </th>

                <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-[#929D97]">
                  Status
                </th>

                <th className="px-5 py-3.5" />
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EEF1EF]">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => onSelect(booking)}
                  className="cursor-pointer transition hover:bg-[#FAFCFA]"
                >
                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-[#26332D]">{booking.customerName}</p>

                    <p className="mt-1 text-[10px] text-[#9AA49F]">{booking.reference}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-[#53605A]">{formatDate(booking.date)}</p>

                    <p className="mt-1 flex items-center gap-1 text-[10px] text-[#9AA49F]">
                      <Clock3 size={10} />
                      {booking.time}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-[#53605A]">{booking.purpose}</span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-[#26332D]">
                      M{booking.amount.toLocaleString()}
                    </p>

                    <p className="mt-1 max-w-[130px] truncate text-[10px] text-[#9AA49F]">
                      {booking.paymentReference}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <ArrowUpRight size={15} className="ml-auto text-[#A0AAA5]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE */}
      <div className="space-y-3 md:hidden">
        {bookings.map((booking) => (
          <button
            key={booking.id}
            type="button"
            onClick={() => onSelect(booking)}
            className="w-full rounded-2xl border border-[#E4E9E4] bg-white p-4 text-left shadow-[0_5px_20px_rgba(6,78,59,0.03)] transition active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#26332D]">{booking.customerName}</p>

                <p className="mt-1 text-[10px] text-[#9AA49F]">{booking.reference}</p>
              </div>

              <StatusBadge status={booking.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EEF1EF] pt-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#A0AAA5]">
                  Event
                </p>

                <p className="mt-1 text-xs font-medium text-[#53605A]">{booking.purpose}</p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#A0AAA5]">
                  Payment
                </p>

                <p className="mt-1 text-xs font-semibold text-[#53605A]">
                  M{booking.amount.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <CalendarDays size={12} className="text-[#047857]" />

                <span className="text-[10px] text-[#66736C]">{formatDate(booking.date)}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock3 size={12} className="text-[#047857]" />

                <span className="text-[10px] text-[#66736C]">{booking.time}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
