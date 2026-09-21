'use client';

import { ArrowLeft, Check, Copy, CreditCard, Landmark, Banknote } from 'lucide-react';
import { useState } from 'react';

import { BOOKING_FEE, MPESA_MERCHANT_NUMBER } from '@/lib/constants';

import type { BookingData, PaymentMethod } from '@/lib/booking';

type Props = {
  booking: BookingData;

  onChange: <K extends keyof BookingData>(field: K, value: BookingData[K]) => void;

  onBack: () => void;
  onSubmit: () => void;
};

const paymentMethods: {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pay using the TRC M-Pesa merchant number.',
    icon: CreditCard,
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Transfer the booking amount to the TRC bank account.',
    icon: Landmark,
  },
  {
    id: 'cash',
    name: 'Cash',
    description: 'Pay directly at the TRC office.',
    icon: Banknote,
  },
];

export default function PaymentDetailsStep({ booking, onChange, onBack, onSubmit }: Props) {
  const [copied, setCopied] = useState(false);

  const totalBookingFee = booking.dates.length * BOOKING_FEE;

  const paymentMethod = booking.paymentMethod;

  const valid =
    Boolean(paymentMethod) &&
    Boolean(booking.fullName.trim()) &&
    Boolean(booking.phone.trim()) &&
    Boolean(booking.whatsapp.trim()) &&
    (paymentMethod === 'cash' || Boolean(booking.paymentReference.trim()));

  async function copyMerchant() {
    await navigator.clipboard.writeText(MPESA_MERCHANT_NUMBER);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">
          Step 3
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          Payment & your details
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#66736C]">
          Choose your payment method and provide the details we need to confirm your booking.
        </p>
      </div>

      {/* PAYMENT METHOD */}
      <section className="rounded-2xl border border-[#E4E9E4] bg-white p-6 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
            Payment
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[#17201C]">How would you like to pay?</h2>

          <p className="mt-1 text-sm text-[#66736C]">Select your preferred payment method.</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const selected = paymentMethod === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onChange('paymentMethod', method.id)}
                className={[
                  'rounded-xl border p-4 text-left transition',
                  selected
                    ? 'border-[#047857] bg-[#ECFDF5] shadow-sm'
                    : 'border-[#E4E9E4] hover:border-[#B7D8CA] hover:bg-[#FAFCFA]',
                ].join(' ')}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={[
                      'flex h-9 w-9 items-center justify-center rounded-lg',
                      selected ? 'bg-[#D1FAE5] text-[#064E3B]' : 'bg-[#F0F5F1] text-[#66736C]',
                    ].join(' ')}
                  >
                    <Icon size={17} />
                  </div>

                  {selected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#047857] text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm font-semibold text-[#17201C]">{method.name}</p>

                <p className="mt-1 text-xs leading-5 text-[#7A857F]">{method.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* PAYMENT INSTRUCTIONS */}
      {paymentMethod && (
        <section className="mt-6 rounded-2xl border border-[#E4E9E4] bg-white p-6 sm:p-8">
          {paymentMethod === 'mpesa' && (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
                M-Pesa payment
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#17201C]">Complete your payment</h2>

              <p className="mt-1 text-sm leading-6 text-[#66736C]">
                Send your booking payment to the M-Pesa merchant number below.
              </p>

              <div className="mt-6 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#047857]">
                  M-Pesa Merchant
                </p>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-2xl font-bold tracking-tight text-[#064E3B]">
                    {MPESA_MERCHANT_NUMBER}
                  </p>

                  <button
                    type="button"
                    onClick={copyMerchant}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B7D8CA] bg-white px-4 py-2.5 text-sm font-medium text-[#064E3B]"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy number
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-5 border-t border-[#D1E8DD] pt-5">
                  <p className="text-xs text-[#66736C]">Amount to pay</p>

                  <p className="mt-1 text-2xl font-bold text-[#17201C]">
                    M{totalBookingFee.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-[#17201C]">
                  M-Pesa payment reference
                </label>

                <input
                  value={booking.paymentReference}
                  onChange={(e) => onChange('paymentReference', e.target.value)}
                  placeholder="Enter your M-Pesa reference"
                  className="mt-2 w-full rounded-xl border border-[#DDE5DF] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#A0AAA5] focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
                />

                <p className="mt-2 text-xs text-[#8A958F]">
                  Keep your M-Pesa confirmation message for verification.
                </p>
              </div>
            </>
          )}

          {paymentMethod === 'bank-transfer' && (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
                Bank transfer
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#17201C]">
                Complete your bank transfer
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#66736C]">
                Transfer the booking amount using the TRC bank details below.
              </p>

              <div className="mt-6 rounded-xl bg-[#F7F8F5] p-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#8A958F]">Bank</p>
                    <p className="mt-1 text-sm font-semibold text-[#17201C]">TRC Bank</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#8A958F]">Account holder</p>
                    <p className="mt-1 text-sm font-semibold text-[#17201C]">TRC Hall</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#8A958F]">Account number</p>
                    <p className="mt-1 text-sm font-semibold text-[#17201C]">
                      Bank details to be provided
                    </p>
                  </div>

                  <div className="border-t border-[#E4E9E4] pt-4">
                    <p className="text-xs text-[#8A958F]">Amount to pay</p>
                    <p className="mt-1 text-2xl font-bold text-[#064E3B]">
                      M{totalBookingFee.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-[#17201C]">Payment reference</label>

                <input
                  value={booking.paymentReference}
                  onChange={(e) => onChange('paymentReference', e.target.value)}
                  placeholder="Enter your transfer reference"
                  className="mt-2 w-full rounded-xl border border-[#DDE5DF] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#A0AAA5] focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
                />
              </div>
            </>
          )}

          {paymentMethod === 'cash' && (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
                Cash payment
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#17201C]">Pay at the TRC office</h2>

              <p className="mt-1 text-sm leading-6 text-[#66736C]">
                You can pay your booking fee directly at the TRC office.
              </p>

              <div className="mt-6 rounded-xl bg-[#ECFDF5] p-5">
                <p className="text-xs text-[#047857]">Amount to pay</p>

                <p className="mt-1 text-2xl font-bold text-[#064E3B]">
                  M{totalBookingFee.toLocaleString()}
                </p>

                <p className="mt-3 text-sm leading-6 text-[#66736C]">
                  Your booking will remain pending until the payment has been received and verified.
                </p>
              </div>
            </>
          )}
        </section>
      )}

      {/* CUSTOMER DETAILS */}
      {paymentMethod && (
        <section className="mt-6 rounded-2xl border border-[#E4E9E4] bg-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
            Your details
          </p>

          <h2 className="mt-2 text-lg font-semibold text-[#17201C]">
            Tell us who is making the booking
          </h2>

          <p className="mt-1 text-sm text-[#66736C]">
            We&apos;ll use these details to confirm your booking.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-[#17201C]">Full name</label>

              <input
                value={booking.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none transition focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#17201C]">Phone number</label>

                <input
                  value={booking.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                  placeholder="+266 ..."
                  className="mt-2 w-full rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none transition focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#17201C]">WhatsApp number</label>

                <input
                  value={booking.whatsapp}
                  onChange={(e) => onChange('whatsapp', e.target.value)}
                  placeholder="+266 ..."
                  className="mt-2 w-full rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none transition focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#17201C]">
                Additional notes
                <span className="ml-1 font-normal text-[#8A958F]">(optional)</span>
              </label>

              <textarea
                value={booking.notes}
                onChange={(e) => onChange('notes', e.target.value)}
                rows={4}
                placeholder="Anything we should know about your event?"
                className="mt-2 w-full resize-none rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none transition focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
              />
            </div>
          </div>
        </section>
      )}

      {/* CONFIRMATION NOTICE */}
      {paymentMethod && (
        <div className="mt-5 rounded-xl bg-[#F0F5F1] p-4 text-sm leading-6 text-[#66736C]">
          Your booking confirmation will be sent to you via WhatsApp after your payment has been
          verified.
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E4E9E4] bg-white px-5 py-3 text-sm font-medium text-[#39443F]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          type="button"
          disabled={!valid}
          onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#075F48] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check size={16} />
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
