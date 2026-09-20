'use client';

import { useState } from 'react';

import {
  CalendarDays,
  Check,
  Clipboard,
  Clock3,
  CreditCard,
  Phone,
  User,
  X,
  XCircle,
} from 'lucide-react';

import type { Payment, PaymentStatus } from './PaymentsPage';

type Props = {
  payment: Payment;
  onClose: () => void;
  onUpdateStatus: (id: string, status: PaymentStatus) => void;
};

const statusStyles: Record<PaymentStatus, string> = {
  PENDING: 'bg-[#FFF7E8] text-[#B45309]',
  PAID: 'bg-[#ECFDF5] text-[#047857]',
  REJECTED: 'bg-[#FEF2F2] text-[#B91C1C]',
  REFUNDED: 'bg-[#F3F4F3] text-[#69736E]',
};

export default function PaymentDetailsModal({ payment, onClose, onUpdateStatus }: Props) {
  const [copied, setCopied] = useState(false);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(payment.paymentReference);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable.
    }
  };

  const handleVerify = () => {
    onUpdateStatus(payment.id, 'PAID');
  };

  const handleReject = () => {
    onUpdateStatus(payment.id, 'REJECTED');
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
        <div className="border-b border-[#E4E9E4] px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                <CreditCard size={20} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A958F]">
                  Payment Details
                </p>

                <h2 className="mt-1 text-lg font-bold tracking-tight text-[#17201C]">
                  {payment.bookingReference}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#66736C] transition hover:bg-[#F3F6F3] hover:text-[#17201C]"
              aria-label="Close payment details"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[payment.status]}`}
            >
              {payment.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-6 sm:px-7">
          {/* Amount */}
          <div className="rounded-2xl border border-[#DDE8E1] bg-[#F7FBF8] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-[#8A958F]">
              Payment Amount
            </p>

            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-3xl font-bold tracking-tight text-[#064E3B]">
                M{payment.amount.toLocaleString()}
              </p>

              <div className="rounded-xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-[#E4E9E4]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A958F]">
                  Method
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#17201C]">{payment.method}</p>
              </div>
            </div>
          </div>

          {/* Transaction */}
          <section className="mt-6">
            <h3 className="mb-4 text-sm font-bold text-[#17201C]">Transaction Information</h3>

            <div className="rounded-2xl border border-[#E4E9E4] p-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
                  M-Pesa Reference
                </p>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-sm font-bold text-[#17201C]">
                    {payment.paymentReference}
                  </p>

                  <button
                    type="button"
                    onClick={copyReference}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E9E4] px-3 py-2 text-xs font-semibold text-[#66736C] transition hover:bg-[#F7F8F5] hover:text-[#064E3B]"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard size={14} />
                        Copy Reference
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-5 border-t border-[#E4E9E4] pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#17201C]">{payment.submittedAt}</p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
                    Verified
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#17201C]">
                    {payment.verifiedAt ?? 'Not verified'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section className="mt-6">
            <h3 className="mb-4 text-sm font-bold text-[#17201C]">Customer</h3>

            <div className="grid gap-4 rounded-2xl border border-[#E4E9E4] p-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F1] text-[#047857]">
                  <User size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#17201C]">
                    {payment.customerName}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F1] text-[#047857]">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A958F]">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#17201C]">
                    {payment.customerPhone}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Booking */}
          <section className="mt-6">
            <h3 className="mb-4 text-sm font-bold text-[#17201C]">Booking</h3>

            <div className="rounded-2xl border border-[#E4E9E4] p-5">
              <p className="text-base font-bold text-[#17201C]">{payment.purpose}</p>

              <p className="mt-1 text-xs text-[#8A958F]">{payment.bookingReference}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <CalendarDays size={17} className="text-[#047857]" />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#8A958F]">Date</p>

                    <p className="mt-0.5 text-sm font-medium text-[#17201C]">{payment.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 size={17} className="text-[#047857]" />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#8A958F]">Time</p>

                    <p className="mt-0.5 text-sm font-medium text-[#17201C]">{payment.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Verification note */}
          {payment.status === 'PENDING' && (
            <div className="mt-6 rounded-2xl border border-[#F4DFC0] bg-[#FFF9EE] p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#D97706]" />

                <div>
                  <p className="text-sm font-semibold text-[#92400E]">
                    Payment verification required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#A16207]">
                    Check the M-Pesa transaction using the reference above before marking this
                    payment as paid.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E4E9E4] bg-white px-5 py-4 sm:px-7">
          {payment.status === 'PENDING' ? (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#F1D5D5] px-5 text-sm font-semibold text-[#B91C1C] transition hover:bg-[#FEF2F2]"
              >
                <XCircle size={17} />
                Reject Payment
              </button>

              <button
                type="button"
                onClick={handleVerify}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#047857] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064E3B]"
              >
                <Check size={17} />
                Verify & Mark Paid
              </button>
            </div>
          ) : payment.status === 'PAID' ? (
            <div className="flex items-center justify-between rounded-xl bg-[#ECFDF5] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D1FAE5] text-[#047857]">
                  <Check size={17} strokeWidth={2.2} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#064E3B]">Payment verified</p>

                  <p className="mt-0.5 text-xs text-[#047857]">
                    Verified by {payment.verifiedBy ?? 'Administrator'}
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
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#17201C] px-5 text-sm font-semibold text-white transition hover:bg-[#064E3B]"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
