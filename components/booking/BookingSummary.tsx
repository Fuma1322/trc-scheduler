import { CalendarDays, Clock3 } from 'lucide-react';

import { ACTIVITIES, BOOKING_FEE, HALF_DAY_SLOTS } from '@/lib/constants';

import type { BookingData } from '@/lib/booking';

type Props = {
  booking: BookingData;
};

export default function BookingSummary({ booking }: Props) {
  const activity = ACTIVITIES.find((item) => item.id === booking.activity);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const getDurationLabel = () => {
    if (!booking.durationType) {
      return 'Not selected';
    }

    if (booking.durationType === 'full-day') {
      return 'Full Day';
    }

    if (booking.durationType === 'half-day') {
      const selectedSlot = HALF_DAY_SLOTS.find((slot) => slot.id === booking.halfDay);

      if (!selectedSlot) {
        return 'Half Day';
      }

      return `${selectedSlot.name} · ${selectedSlot.time}`;
    }

    if (booking.durationType === 'custom' && booking.startTime && booking.endTime) {
      return `${booking.startTime} – ${booking.endTime}`;
    }

    return 'Custom Hours';
  };

  const getDateLabel = () => {
    if (booking.dates.length === 0) {
      return 'Not selected';
    }

    if (booking.dates.length === 1) {
      return formatDate(booking.dates[0]);
    }

    return `${booking.dates.length} dates selected`;
  };

  return (
    <aside className="sticky top-28 rounded-2xl border border-[#E4E9E4] bg-white p-6 shadow-[0_10px_40px_rgba(6,78,59,0.06)]">
      {/* HEADER */}
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
        Your booking
      </p>

      <h2 className="mt-3 text-xl font-semibold text-[#17201C]">{activity?.name ?? 'TRC Hall'}</h2>

      {/* DETAILS */}
      <div className="my-6 space-y-5 border-y border-[#E4E9E4] py-5">
        {/* DATES */}
        <div className="flex gap-3">
          <CalendarDays size={17} className="mt-0.5 shrink-0 text-[#047857]" />

          <div className="min-w-0">
            <p className="text-[11px] text-[#8A958F]">
              {booking.dates.length > 1 ? 'Dates' : 'Date'}
            </p>

            {booking.dates.length <= 1 ? (
              <p className="mt-1 text-sm font-medium text-[#39443F]">{getDateLabel()}</p>
            ) : (
              <div className="mt-2 space-y-1">
                {booking.dates.map((date) => (
                  <p key={date.toISOString()} className="text-sm font-medium text-[#39443F]">
                    {formatDate(date)}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DURATION / TIME */}
        <div className="flex gap-3">
          <Clock3 size={17} className="mt-0.5 shrink-0 text-[#047857]" />

          <div>
            <p className="text-[11px] text-[#8A958F]">Duration</p>

            <p className="mt-1 text-sm font-medium text-[#39443F]">{getDurationLabel()}</p>
          </div>
        </div>
      </div>

      {/* PRICE */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#66736C]">Booking fee</span>

        <span className="text-lg font-semibold text-[#17201C]">M{BOOKING_FEE}</span>
      </div>

      {/* MULTI-DAY INDICATOR */}
      {booking.dates.length > 1 && (
        <div className="mt-5 rounded-xl bg-[#ECFDF5] px-4 py-3">
          <p className="text-xs font-medium text-[#064E3B]">{booking.dates.length} booking days</p>

          <p className="mt-1 text-xs leading-5 text-[#047857]">
            The selected duration will apply to each selected date.
          </p>
        </div>
      )}
    </aside>
  );
}
