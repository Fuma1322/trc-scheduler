'use client';

import { ArrowLeft, Check } from 'lucide-react';

type Props = {
  fullName: string;
  phone: string;
  whatsapp: string;
  notes: string;

  onChange: (field: 'fullName' | 'phone' | 'whatsapp' | 'notes', value: string) => void;

  onBack: () => void;
  onSubmit: () => void;
};

export default function DetailsStep({
  fullName,
  phone,
  whatsapp,
  notes,
  onChange,
  onBack,
  onSubmit,
}: Props) {
  const valid = fullName.trim() && phone.trim() && whatsapp.trim();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">
          Step 4
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          Your details
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#66736C]">
          We&apos;ll use these details to confirm your booking.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#E4E9E4] bg-white p-6 sm:p-8">
        <div>
          <label className="text-sm font-medium text-[#17201C]">Full name</label>

          <input
            value={fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="Your full name"
            className="mt-2 w-full rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#17201C]">Phone number</label>

          <input
            value={phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+266 ..."
            className="mt-2 w-full rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#17201C]">WhatsApp number</label>

          <input
            value={whatsapp}
            onChange={(e) => onChange('whatsapp', e.target.value)}
            placeholder="+266 ..."
            className="mt-2 w-full rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#17201C]">
            Additional notes
            <span className="ml-1 font-normal text-[#8A958F]">(optional)</span>
          </label>

          <textarea
            value={notes}
            onChange={(e) => onChange('notes', e.target.value)}
            rows={4}
            placeholder="Anything we should know about your event?"
            className="mt-2 w-full resize-none rounded-xl border border-[#DDE5DF] px-4 py-3 text-sm outline-none focus:border-[#047857] focus:ring-4 focus:ring-[#ECFDF5]"
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-[#F0F5F1] p-4 text-sm text-[#66736C]">
        Your booking confirmation will be sent to you via WhatsApp.
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
