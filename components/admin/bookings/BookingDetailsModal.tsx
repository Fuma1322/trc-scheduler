'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Check,
  Clipboard,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';

import type { Booking, BookingStatus } from './BookingsPage';

type Props = {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
};

const statusStyles: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-[#FFF7E8] text-[#B45309]',
  },
  PAID: {
    label: 'Paid',
    className: 'bg-[#ECFDF5] text-[#047857]',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-[#FEF2F2] text-[#B91C1C]',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-[#F3F4F3] text-[#69736E]',
  },
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F1] text-[#047857]">
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[#17201C]">{value}</p>
      </div>
    </div>
  );
}

export default function BookingDetailsModal({ booking, onClose, onUpdateStatus }: Props) {
  const [copied, setCopied] = useState(false);

  const status = statusStyles[booking.status];

  const copyPaymentReference = async () => {
    if (!booking.paymentReference) return;

    try {
      await navigator.clipboard.writeText(booking.paymentReference);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard access may be unavailable in some browsers.
    }
  };

  const handleMarkPaid = () => {
    onUpdateStatus(booking.id, 'PAID');
  };

  const handleReject = () => {
    onUpdateStatus(booking.id, 'REJECTED');
  };

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
        <div className="flex items-start justify-between border-b border-[#E4E9E4] px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                <CalendarDays size={20} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A958F]">
                  Booking Details
                </p>

                <h2 className="mt-1 text-lg font-bold tracking-tight text-[#17201C]">
                  {booking.reference}
                </h2>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>

              {booking.status === 'PAID' && (
                <span className="flex items-center gap-1 text-xs text-[#047857]">
                  <Check size={14} strokeWidth={2.2} />
                  Confirmed
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#66736C] transition hover:bg-[#F3F6F3] hover:text-[#17201C]"
            aria-label="Close booking details"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-6 sm:px-7">
          {/* Event summary */}
          <div className="rounded-2xl border border-[#DDE8E1] bg-[#F7FBF8] p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.13em] text-[#8A958F]">
                  Event
                </p>

                <h3 className="mt-1 text-xl font-bold tracking-tight text-[#17201C]">
                  {booking.purpose}
                </h3>
              </div>

              <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#E4E9E4]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                  Amount
                </p>

                <p className="mt-1 text-lg font-bold text-[#064E3B]">
                  M{booking.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-[#DDE8E1] pt-5 sm:grid-cols-2">
              <DetailRow icon={CalendarDays} label="Date" value={booking.date} />

              <DetailRow icon={Clock3} label="Time" value={booking.time} />
            </div>
          </div>

          {/* Customer */}
          <section className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <Users size={17} className="text-[#047857]" strokeWidth={1.8} />

              <h3 className="text-sm font-bold text-[#17201C]">Customer Information</h3>
            </div>

            <div className="grid gap-5 rounded-2xl border border-[#E4E9E4] p-5 sm:grid-cols-2">
              <DetailRow icon={User} label="Full Name" value={booking.customerName} />

              <DetailRow icon={Phone} label="Phone" value={booking.phone} />

              <DetailRow icon={Phone} label="WhatsApp" value={booking.whatsapp} />

              <DetailRow icon={MapPin} label="Venue" value="TRC Hall" />
            </div>
          </section>

          {/* Payment */}
          <section className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard size={17} className="text-[#047857]" strokeWidth={1.8} />

              <h3 className="text-sm font-bold text-[#17201C]">Payment Information</h3>
            </div>

            <div className="rounded-2xl border border-[#E4E9E4] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
                    M-Pesa Reference
                  </p>

                  <p className="mt-1 font-mono text-sm font-semibold text-[#17201C]">
                    {booking.paymentReference || 'Not provided'}
                  </p>
                </div>

                {booking.paymentReference && (
                  <button
                    type="button"
                    onClick={copyPaymentReference}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E9E4] px-3 py-2 text-xs font-semibold text-[#66736C] transition hover:border-[#C9D8CE] hover:bg-[#F7F8F5] hover:text-[#064E3B]"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard size={14} />
                        Copy reference
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-4 rounded-xl bg-[#F7F8F5] px-4 py-3">
                <p className="text-xs leading-5 text-[#66736C]">
                  Verify the M-Pesa payment against the submitted reference before marking this
                  booking as paid.
                </p>
              </div>
            </div>
          </section>

          {/* Notes */}
          {booking.notes && (
            <section className="mt-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText size={17} className="text-[#047857]" strokeWidth={1.8} />

                <h3 className="text-sm font-bold text-[#17201C]">Customer Notes</h3>
              </div>

              <div className="rounded-2xl border border-[#E4E9E4] bg-[#F7F8F5] p-5">
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#66736C]">
                  {booking.notes}
                </p>
              </div>
            </section>
          )}

          {/* Created */}
          <div className="mt-6 text-xs text-[#8A958F]">
            Booking submitted on {booking.createdAt}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#E4E9E4] bg-white px-5 py-4 sm:px-7">
          {booking.status === 'PENDING' ? (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#F1D5D5] px-5 text-sm font-semibold text-[#B91C1C] transition hover:bg-[#FEF2F2]"
              >
                <XCircle size={17} strokeWidth={1.8} />
                Reject Booking
              </button>

              <button
                type="button"
                onClick={handleMarkPaid}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#047857] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064E3B]"
              >
                <Check size={17} strokeWidth={2} />
                Verify & Mark Paid
              </button>
            </div>
          ) : booking.status === 'PAID' ? (
            <div className="flex items-center justify-between gap-4 rounded-xl bg-[#ECFDF5] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D1FAE5] text-[#047857]">
                  <Check size={17} strokeWidth={2.2} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#064E3B]">Booking confirmed</p>

                  <p className="mt-0.5 text-xs text-[#047857]">
                    This booking is blocking the selected time slot.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-[#047857] transition hover:bg-white sm:block"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#17201C] px-5 text-sm font-semibold text-white transition hover:bg-[#064E3B]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
