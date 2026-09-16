import { CalendarDays, Clock3 } from 'lucide-react';

import { ACTIVITIES, BOOKING_FEE } from '@/lib/constants';
import type { BookingData } from '@/lib/booking';

type Props = {
  booking: BookingData;
};

export default function BookingSummary({ booking }: Props) {
  const activity = ACTIVITIES.find(
    (item) => item.id === booking.activity
  );

  return (
    <aside className="sticky top-28 rounded-2xl border border-[#E4E9E4] bg-white p-6 shadow-[0_10px_40px_rgba(6,78,59,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#047857]">
        Your booking
      </p>

      <h2 className="mt-3 text-xl font-semibold text-[#17201C]">
        {activity?.name ?? 'TRC Hall'}
      </h2>

      <div className="my-6 space-y-4 border-y border-[#E4E9E4] py-5">
        <div className="flex gap-3">
          <CalendarDays
            size={17}
            className="mt-0.5 text-[#047857]"
          />

          <div>
            <p className="text-[11px] text-[#8A958F]">
              Date
            </p>

            <p className="mt-1 text-sm font-medium text-[#39443F]">
              {booking.date
                ? booking.date.toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Not selected'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Clock3
            size={17}
            className="mt-0.5 text-[#047857]"
          />

          <div>
            <p className="text-[11px] text-[#8A958F]">
              Time
            </p>

            <p className="mt-1 text-sm font-medium text-[#39443F]">
              {booking.timeSlot ?? 'Not selected'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#66736C]">
          Booking fee
        </span>

        <span className="text-lg font-semibold text-[#17201C]">
          M{BOOKING_FEE}
        </span>
      </div>
    </aside>
  );
}