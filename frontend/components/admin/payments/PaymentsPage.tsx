'use client';

import { useMemo, useState } from 'react';

import PaymentFilters from './PaymentFilters';
import PaymentTable from './PaymentTable';
import PaymentDetailsModal from './PaymentDetailsModal';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REJECTED' | 'REFUNDED';

export type Payment = {
  id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  purpose: string;
  date: string;
  time: string;
  amount: number;
  method: 'M-Pesa';
  paymentReference: string;
  status: PaymentStatus;
  submittedAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
};

const initialPayments: Payment[] = [
  {
    id: 'pay-001',
    bookingReference: 'TRC-2026-0148',
    customerName: 'Mpho Mokoena',
    customerPhone: '+266 5912 3456',
    purpose: 'Wedding',
    date: '2026-09-24',
    time: '10:00 - 16:00',
    amount: 5000,
    method: 'M-Pesa',
    paymentReference: 'MPESA784521',
    status: 'PAID',
    submittedAt: '2026-09-20 09:42',
    verifiedAt: '2026-09-20 10:15',
    verifiedBy: 'Administrator',
  },
  {
    id: 'pay-002',
    bookingReference: 'TRC-2026-0149',
    customerName: 'Thabiso Molapo',
    customerPhone: '+266 6334 7821',
    purpose: 'Workshop',
    date: '2026-09-26',
    time: '08:00 - 13:00',
    amount: 2500,
    method: 'M-Pesa',
    paymentReference: 'MPESA912834',
    status: 'PAID',
    submittedAt: '2026-09-21 11:24',
    verifiedAt: '2026-09-21 12:02',
    verifiedBy: 'Administrator',
  },
  {
    id: 'pay-003',
    bookingReference: 'TRC-2026-0150',
    customerName: 'Lerato Nthunya',
    customerPhone: '+266 5891 2345',
    purpose: 'Birthday',
    date: '2026-09-27',
    time: '14:00 - 18:00',
    amount: 3000,
    method: 'M-Pesa',
    paymentReference: 'MPESA663921',
    status: 'PENDING',
    submittedAt: '2026-09-22 08:31',
    verifiedAt: null,
    verifiedBy: null,
  },
  {
    id: 'pay-004',
    bookingReference: 'TRC-2026-0151',
    customerName: 'Kabelo Phiri',
    customerPhone: '+266 6212 9981',
    purpose: 'Meeting',
    date: '2026-09-29',
    time: '09:00 - 12:00',
    amount: 1500,
    method: 'M-Pesa',
    paymentReference: 'MPESA118234',
    status: 'PENDING',
    submittedAt: '2026-09-22 09:14',
    verifiedAt: null,
    verifiedBy: null,
  },
  {
    id: 'pay-005',
    bookingReference: 'TRC-2026-0152',
    customerName: 'Masechaba Raleche',
    customerPhone: '+266 5845 2217',
    purpose: 'Funeral',
    date: '2026-09-30',
    time: '08:00 - 14:00',
    amount: 4000,
    method: 'M-Pesa',
    paymentReference: 'MPESA000812',
    status: 'REJECTED',
    submittedAt: '2026-09-22 09:41',
    verifiedAt: '2026-09-22 10:02',
    verifiedBy: 'Administrator',
  },
  {
    id: 'pay-006',
    bookingReference: 'TRC-2026-0153',
    customerName: 'Neo Matete',
    customerPhone: '+266 5978 4412',
    purpose: 'Workshop',
    date: '2026-10-02',
    time: '10:00 - 15:00',
    amount: 2500,
    method: 'M-Pesa',
    paymentReference: 'MPESA882341',
    status: 'PENDING',
    submittedAt: '2026-09-22 10:18',
    verifiedAt: null,
    verifiedBy: null,
  },
  {
    id: 'pay-007',
    bookingReference: 'TRC-2026-0122',
    customerName: 'Palesa Thabane',
    customerPhone: '+266 6301 1122',
    purpose: 'Meeting',
    date: '2026-09-12',
    time: '10:00 - 12:00',
    amount: 1500,
    method: 'M-Pesa',
    paymentReference: 'MPESA451287',
    status: 'REFUNDED',
    submittedAt: '2026-09-08 14:21',
    verifiedAt: '2026-09-08 15:03',
    verifiedBy: 'Administrator',
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentStatus>('ALL');

  const [search, setSearch] = useState('');

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;

      const matchesSearch =
        !query ||
        payment.customerName.toLowerCase().includes(query) ||
        payment.bookingReference.toLowerCase().includes(query) ||
        payment.paymentReference.toLowerCase().includes(query) ||
        payment.purpose.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [payments, search, statusFilter]);

  const paidPayments = payments.filter((payment) => payment.status === 'PAID');

  const pendingPayments = payments.filter((payment) => payment.status === 'PENDING');

  const refundedPayments = payments.filter((payment) => payment.status === 'REFUNDED');

  const totalPaid = paidPayments.reduce((total, payment) => total + payment.amount, 0);

  const pendingAmount = pendingPayments.reduce((total, payment) => total + payment.amount, 0);

  const refundedAmount = refundedPayments.reduce((total, payment) => total + payment.amount, 0);

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setPayments((currentPayments) =>
      currentPayments.map((payment) => {
        if (payment.id !== id) {
          return payment;
        }

        const updatedPayment = {
          ...payment,
          status,
          verifiedAt:
            status === 'PAID' || status === 'REJECTED'
              ? new Date().toISOString()
              : payment.verifiedAt,
          verifiedBy:
            status === 'PAID' || status === 'REJECTED' ? 'Administrator' : payment.verifiedBy,
        };

        if (selectedPayment?.id === id) {
          setSelectedPayment(updatedPayment);
        }

        return updatedPayment;
      })
    );
  };

  const counts = {
    ALL: payments.length,
    PENDING: payments.filter((payment) => payment.status === 'PENDING').length,
    PAID: payments.filter((payment) => payment.status === 'PAID').length,
    REJECTED: payments.filter((payment) => payment.status === 'REJECTED').length,
    REFUNDED: payments.filter((payment) => payment.status === 'REFUNDED').length,
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
            Finance
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#17201C] sm:text-3xl">
                Payments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66736C]">
                Review M-Pesa payments, verify transactions, and monitor TRC Hall revenue.
              </p>
            </div>

            {pendingPayments.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-[#F4DFC0] bg-[#FFF9EE] px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-[#D97706]" />

                <p className="text-xs font-semibold text-[#92400E]">
                  {pendingPayments.length} payment
                  {pendingPayments.length !== 1 ? 's' : ''} awaiting verification
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Total Paid
            </p>

            <p className="mt-2 text-2xl font-bold text-[#047857]">M{totalPaid.toLocaleString()}</p>

            <p className="mt-1 text-xs text-[#66736C]">
              {paidPayments.length} verified transaction
              {paidPayments.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-[#B45309]">
              M{pendingAmount.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-[#66736C]">Awaiting verification</p>
          </div>

          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Transactions
            </p>

            <p className="mt-2 text-2xl font-bold text-[#17201C]">{payments.length}</p>

            <p className="mt-1 text-xs text-[#66736C]">All payment records</p>
          </div>

          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Refunded
            </p>

            <p className="mt-2 text-2xl font-bold text-[#69736E]">
              M{refundedAmount.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-[#66736C]">Returned to customers</p>
          </div>
        </div>

        {/* Payment list */}
        <div className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <PaymentFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            counts={counts}
          />

          <PaymentTable payments={filteredPayments} onSelectPayment={setSelectedPayment} />
        </div>
      </div>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onUpdateStatus={updatePaymentStatus}
        />
      )}
    </>
  );
}
