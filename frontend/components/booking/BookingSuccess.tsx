import Link from 'next/link';
import { Check, MessageCircle } from 'lucide-react';

type BookingSuccessProps = {
  reference?: string;
  activity?: string;
  dates?: string;
  startTime?: string;
  endTime?: string;
  amount?: string;
  status?: string;
  paymentStatus?: string;
};

function formatActivity(value: string): string {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return value;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(value: string): string {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) return value;

  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

export default function BookingSuccess({
  reference,
  activity,
  dates,
  startTime,
  endTime,
  amount,
  status,
  paymentStatus,
}: BookingSuccessProps) {
  const bookingDates = dates ? dates.split(',').filter(Boolean) : [];
  const hasBookingDetails = Boolean(reference);
  const isQuoteRequired = amount === 'quote';
  const isPending = status?.toUpperCase() === 'PENDING';

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-[#064E3B]">
          <Check size={30} strokeWidth={2} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#047857]">
          Booking request received
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          Your TRC Hall request has been submitted.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#66736C]">
          {isPending
            ? 'Your request is pending confirmation. This page does not mean your booking or payment has been approved. Please wait for TRC to confirm the booking.'
            : 'Your request has been received. Please contact TRC to confirm its current status.'}
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E4E9E4] bg-white p-6 text-left">
          {hasBookingDetails ? (
            <>
              <p className="text-xs text-[#8A958F]">Booking reference</p>
              <p className="mt-1 break-all text-lg font-semibold text-[#064E3B]">
                {reference}
              </p>

              <div className="my-5 border-t border-[#E4E9E4]" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#8A958F]">Activity</span>
                  <span className="text-right font-medium text-[#39443F]">
                    {activity ? formatActivity(activity) : '—'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#8A958F]">
                    {bookingDates.length === 1 ? 'Date' : 'Dates'}
                  </span>
                  <span className="text-right font-medium text-[#39443F]">
                    {bookingDates.length
                      ? bookingDates.map(formatDate).join(', ')
                      : '—'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#8A958F]">Time</span>
                  <span className="text-right font-medium text-[#39443F]">
                    {startTime && endTime
                      ? `${formatTime(startTime)} – ${formatTime(endTime)}`
                      : '—'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#8A958F]">Booking status</span>
                  <span className="text-right font-medium text-amber-700">
                    {status || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#8A958F]">Payment status</span>
                  <span className="text-right font-medium text-amber-700">
                    {paymentStatus || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-t border-[#E4E9E4] pt-4">
                  <span className="text-[#8A958F]">Booking fee</span>
                  <span className="text-right font-semibold text-[#17201C]">
                    {isQuoteRequired
                      ? 'Quote required'
                      : amount !== undefined && amount !== ''
                        ? `M ${Number(amount).toLocaleString('en-US')}`
                        : 'To be confirmed'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm leading-6 text-[#66736C]">
              No booking reference was provided in this page address. Please
              use the reference from your successful booking submission or
              contact TRC to verify your request.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-start justify-center gap-2 text-left text-sm leading-6 text-[#66736C]">
          <MessageCircle
            size={17}
            className="mt-1 shrink-0 text-[#047857]"
          />
          <p>
            Please wait for TRC to confirm your booking and payment. A WhatsApp
            message is not sent automatically by this page.
          </p>
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
