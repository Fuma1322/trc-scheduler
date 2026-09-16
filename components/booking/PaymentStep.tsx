'use client';

import { ArrowLeft, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { MPESA_MERCHANT_NUMBER } from '@/lib/constants';

type Props = {
  paymentReference: string;
  onPaymentReferenceChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function PaymentStep({
  paymentReference,
  onPaymentReferenceChange,
  onBack,
  onContinue,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyMerchant() {
    await navigator.clipboard.writeText(MPESA_MERCHANT_NUMBER);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">
          Step 3
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          How to complete your booking
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#66736C]">
          Complete payment using M-Pesa, then enter your payment
          reference below.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
          M-Pesa Merchant
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-3xl font-bold tracking-tight text-[#064E3B]">
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

        <div className="mt-8 border-t border-[#D1E8DD] pt-6">
          <p className="text-sm font-medium text-[#39443F]">
            Payment amount
          </p>

          <p className="mt-1 text-2xl font-semibold text-[#17201C]">
            M500
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold text-[#17201C]">
          How it works
        </h2>

        <div className="mt-5 space-y-4">
          {[
            'Make your payment using the M-Pesa merchant number above.',
            'Keep your M-Pesa payment confirmation.',
            'Enter your payment reference below.',
          ].map((item, index) => (
            <div
              key={item}
              className="flex gap-4"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-xs font-semibold text-[#064E3B]">
                {index + 1}
              </div>

              <p className="pt-1 text-sm leading-6 text-[#66736C]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-medium text-[#17201C]">
          Payment reference
        </label>

        <input
          value={paymentReference}
          onChange={(e) =>
            onPaymentReferenceChange(e.target.value)
          }
          placeholder="Enter your M-Pesa reference"
          className="mt-2 w-full rounded-xl border border-[#DDE5DF] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#A0AAA5] focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
        />
      </div>

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
          disabled={!paymentReference.trim()}
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}