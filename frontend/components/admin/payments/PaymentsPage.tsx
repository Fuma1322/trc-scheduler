'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

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

type ApiPayment = {
  id: string;
  bookingReference?: string;
  reference?: string;
  customerName?: string;
  customerPhone?: string;
  phone?: string;
  purpose?: string;
  date?: string;
  dates?: string[];
  time?: string;
  startTime?: string;
  endTime?: string;
  amount?: number | null;
  method?: string;
  paymentMethod?: string;
  paymentReference?: string;
  status?: PaymentStatus;
  paymentStatus?: PaymentStatus;
  submittedAt?: string | null;
  createdAt?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

function formatDate(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function toPayment(record: ApiPayment): Payment {
  const status = record.status ?? record.paymentStatus ?? 'PENDING';
  const dates = record.dates ?? [];

  const startTime = record.startTime ?? '';
  const endTime = record.endTime ?? '';

  return {
    id: record.id,
    bookingReference: record.bookingReference ?? record.reference ?? '',
    customerName: record.customerName ?? '',
    customerPhone: record.customerPhone ?? record.phone ?? '',
    purpose: record.purpose ?? '',
    date: record.date ?? dates[0] ?? '',
    time:
      record.time ||
      (startTime && endTime ? `${startTime} - ${endTime}` : ''),
    // The existing UI expects a number. A missing amount is displayed as zero.
    amount:
      typeof record.amount === 'number' && Number.isFinite(record.amount)
        ? record.amount
        : 0,
    // Keep the current modal/table type compatible with the existing UI.
    method: 'M-Pesa',
    paymentReference: record.paymentReference ?? '',
    status,
    submittedAt: formatDate(record.submittedAt ?? record.createdAt),
    verifiedAt: record.verifiedAt ? formatDate(record.verifiedAt) : null,
    verifiedBy: record.verifiedBy ?? null,
  };
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === 'object' &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message;
  }

  return fallback;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPayments = useCallback(async (status: 'ALL' | PaymentStatus) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('trc_admin_token')
        : null;

    if (!token) {
      setError('Your admin session is missing. Please sign in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const query = status === 'ALL'
        ? ''
        : `?status=${encodeURIComponent(status)}`;

      const response = await fetch(`${API_URL}/api/admin/payments${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      const body = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        setError('Your admin session has expired. Please sign in again.');
        return;
      }

      if (!response.ok || body?.success !== true || !Array.isArray(body.data)) {
        throw new Error(getErrorMessage(body, 'Could not load payments.'));
      }

      const loadedPayments = (body.data as ApiPayment[]).map(toPayment);
      setPayments(loadedPayments);

      setSelectedPayment((current) => {
        if (!current) return null;
        return loadedPayments.find((payment) => payment.id === current.id) ?? null;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load payments. Check that the backend is running.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPayments('ALL');
  }, [loadPayments]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === 'ALL' || payment.status === statusFilter;

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
  const pendingPayments = payments.filter(
    (payment) => payment.status === 'PENDING',
  );
  const refundedPayments = payments.filter(
    (payment) => payment.status === 'REFUNDED',
  );

  const totalPaid = paidPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const pendingAmount = pendingPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const refundedAmount = refundedPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const updatePaymentStatus = async (
    id: string,
    status: PaymentStatus,
  ) => {
    if (updatingId) return;

    const token = localStorage.getItem('trc_admin_token');

    if (!token) {
      setError('Your admin session is missing. Please sign in again.');
      return;
    }

    setUpdatingId(id);
    setError('');
    setNotice('');

    try {
      const response = await fetch(
        `${API_URL}/api/admin/payments/${encodeURIComponent(id)}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ status }),
        },
      );

      const body = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        throw new Error('Your admin session has expired. Please sign in again.');
      }

      if (!response.ok || body?.success !== true) {
        throw new Error(
          getErrorMessage(body, 'Could not update payment status.'),
        );
      }

      setNotice(`Payment status updated to ${status}.`);
      await loadPayments('ALL');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not update payment status.',
      );
    } finally {
      setUpdatingId(null);
    }
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
                Review submitted payments, verify transactions, and monitor TRC Hall revenue.
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

        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>
            <div className="flex gap-3">
              {(error.includes('session') || error.includes('sign in')) && (
                <a className="font-semibold underline" href="/login">
                  Sign in
                </a>
              )}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => void loadPayments('ALL')}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            {notice}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A958F]">
              Total Paid
            </p>
            <p className="mt-2 text-2xl font-bold text-[#047857]">
              M{totalPaid.toLocaleString()}
            </p>
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
            <p className="mt-2 text-2xl font-bold text-[#17201C]">
              {payments.length}
            </p>
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

        <div className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <PaymentFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            counts={counts}
          />

          {loading ? (
            <div className="p-10 text-center text-sm text-[#66736C]">
              Loading payments from the server…
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-[#17201C]">
                {payments.length === 0 ? 'No payment records found' : 'No matching payments'}
              </p>
              <p className="mt-2 text-sm text-[#66736C]">
                {payments.length === 0
                  ? 'Payments will appear here when bookings are recorded.'
                  : 'Try changing your search or status filter.'}
              </p>
            </div>
          ) : (
            <PaymentTable
              payments={filteredPayments}
              onSelectPayment={setSelectedPayment}
            />
          )}
        </div>
      </div>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onUpdateStatus={updatePaymentStatus}
        />
      )}

      {updatingId && (
        <div
          className="fixed bottom-5 right-5 z-50 rounded-xl bg-[#17201C] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          Saving payment status…
        </div>
      )}
    </>
  );
}
