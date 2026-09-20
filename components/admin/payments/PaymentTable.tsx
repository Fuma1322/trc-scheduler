'use client';

import { ChevronRight, CreditCard, Phone } from 'lucide-react';

import type { Payment } from './PaymentsPage';

type Props = {
  payments: Payment[];
  onSelectPayment: (payment: Payment) => void;
};

const statusStyles = {
  PENDING: 'bg-[#FFF7E8] text-[#B45309]',
  PAID: 'bg-[#ECFDF5] text-[#047857]',
  REJECTED: 'bg-[#FEF2F2] text-[#B91C1C]',
  REFUNDED: 'bg-[#F3F4F3] text-[#69736E]',
};

export default function PaymentTable({ payments, onSelectPayment }: Props) {
  if (payments.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#047857]">
          <CreditCard size={21} strokeWidth={1.8} />
        </div>

        <h3 className="mt-4 text-sm font-bold text-[#17201C]">No payments found</h3>

        <p className="mt-1 max-w-sm text-sm text-[#66736C]">
          Try adjusting your search or payment status filter.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E4E9E4] bg-[#FAFBFA] text-left">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Customer
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Booking
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Amount
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                M-Pesa Reference
              </th>

              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A958F]">
                Status
              </th>

              <th className="px-6 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E4E9E4]">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                onClick={() => onSelectPayment(payment)}
                className="cursor-pointer transition hover:bg-[#FAFCFA]"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-[#17201C]">{payment.customerName}</p>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A958F]">
                    <Phone size={12} />
                    {payment.customerPhone}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-[#17201C]">{payment.bookingReference}</p>

                  <p className="mt-1 text-xs text-[#8A958F]">{payment.purpose}</p>
                </td>

                <td className="px-6 py-4 text-sm font-bold text-[#17201C]">
                  M{payment.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-medium text-[#66736C]">
                    {payment.paymentReference}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[payment.status]}`}
                  >
                    {payment.status}
                  </span>
                </td>

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
        {payments.map((payment) => (
          <button
            key={payment.id}
            type="button"
            onClick={() => onSelectPayment(payment)}
            className="w-full p-4 text-left transition active:bg-[#FAFCFA]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#17201C]">
                  {payment.customerName}
                </p>

                <p className="mt-1 text-xs text-[#8A958F]">{payment.bookingReference}</p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[payment.status]}`}
              >
                {payment.status}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-lg font-bold text-[#17201C]">
                  M{payment.amount.toLocaleString()}
                </p>

                <p className="mt-1 font-mono text-[11px] text-[#8A958F]">
                  {payment.paymentReference}
                </p>
              </div>

              <ChevronRight size={18} className="text-[#A0AAA4]" strokeWidth={1.8} />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
