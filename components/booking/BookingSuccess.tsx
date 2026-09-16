import Link from 'next/link';
import { Check, MessageCircle } from 'lucide-react';

export default function BookingSuccess() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-[#064E3B]">
          <Check size={30} strokeWidth={2} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#047857]">
          Booking confirmed
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          Your TRC Hall booking is confirmed.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#66736C]">
          We&apos;ve received your booking details. A confirmation will be sent to your WhatsApp
          number.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E4E9E4] bg-white p-6 text-left">
          <p className="text-xs text-[#8A958F]">Booking reference</p>

          <p className="mt-1 text-lg font-semibold text-[#064E3B]">TRC-2026-0148</p>

          <div className="my-5 border-t border-[#E4E9E4]" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8A958F]">Activity</span>

              <span className="font-medium text-[#39443F]">Wedding</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8A958F]">Date</span>

              <span className="font-medium text-[#39443F]">16 September 2026</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8A958F]">Time</span>

              <span className="font-medium text-[#39443F]">14:00 – 16:00</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#66736C]">
          <MessageCircle size={17} className="text-[#047857]" />
          WhatsApp confirmation will be sent shortly.
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-[#064E3B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#075F48]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
