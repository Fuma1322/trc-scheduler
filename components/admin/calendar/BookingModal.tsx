'use client';

import { CalendarDays, Clock3, CreditCard, Phone, User2, X } from 'lucide-react';

import type { Booking } from '../../../lib/calendar-data';

type Props = {
  booking: Booking | null;
  onClose: () => void;
};

export default function BookingModal({ booking, onClose }: Props) {
  if (!booking) return null;

  const dateLabel = new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0B1F18]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-[26px] bg-white shadow-[0_25px_80px_rgba(6,78,59,0.2)] sm:rounded-[26px]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-[#E5EAE6] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9AA49F]">
              Booking {booking.id}
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#17201C]">
              {booking.purpose}
            </h2>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[9px] font-semibold capitalize text-[#047857]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#047857]" />
              {booking.status}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#8A958F] transition hover:bg-[#F7F8F6] hover:text-[#17201C]"
            aria-label="Close booking details"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* DATE */}
            <div className="rounded-xl border border-[#E5EAE6] bg-[#FAFBF9] p-4">
              <div className="flex items-center gap-2 text-[#047857]">
                <CalendarDays size={15} />

                <span className="text-[9px] font-bold uppercase tracking-[0.14em]">Date</span>
              </div>

              <p className="mt-2 text-xs font-semibold text-[#34403A]">{dateLabel}</p>
            </div>

            {/* TIME */}
            <div className="rounded-xl border border-[#E5EAE6] bg-[#FAFBF9] p-4">
              <div className="flex items-center gap-2 text-[#047857]">
                <Clock3 size={15} />

                <span className="text-[9px] font-bold uppercase tracking-[0.14em]">Time</span>
              </div>

              <p className="mt-2 text-xs font-semibold text-[#34403A]">
                {booking.startTime} – {booking.endTime}
              </p>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="mt-3 rounded-xl border border-[#E5EAE6] p-4">
            <div className="flex items-center gap-2 text-[#047857]">
              <User2 size={15} />

              <span className="text-[9px] font-bold uppercase tracking-[0.14em]">Booker</span>
            </div>

            <p className="mt-2 text-sm font-bold text-[#17201C]">{booking.customerName}</p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#7A857F]">
              <Phone size={12} />

              {booking.phone}
            </div>
          </div>

          {/* DESCRIPTION */}
          {booking.description && (
            <div className="mt-3 rounded-xl border border-[#E5EAE6] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9AA49F]">
                Purpose & Notes
              </p>

              <p className="mt-2 text-xs leading-5 text-[#5E6963]">{booking.description}</p>
            </div>
          )}

          {/* PAYMENT */}
          <div className="mt-3 rounded-xl border border-[#E5EAE6] p-4">
            <div className="flex items-center gap-2 text-[#047857]">
              <CreditCard size={15} />

              <span className="text-[9px] font-bold uppercase tracking-[0.14em]">Payment</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold capitalize text-[#34403A]">
                  {booking.paymentMethod ?? 'Not provided'}
                </p>

                {booking.paymentReference && (
                  <p className="mt-1 text-[10px] text-[#8A958F]">Ref: {booking.paymentReference}</p>
                )}
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-bold capitalize ${
                  booking.paymentStatus === 'paid'
                    ? 'bg-[#ECFDF5] text-[#047857]'
                    : 'bg-[#FFFBEB] text-[#B45309]'
                } `}
              >
                {booking.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-[#E5EAE6] bg-[#FAFBF9] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#064E3B] px-4 py-3 text-xs font-semibold text-white shadow-[0_5px_18px_rgba(6,78,59,0.15)] transition hover:bg-[#053F30]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
