'use client';

import { timeSlots, type Booking } from '../../../lib/calendar-data';
import BookingCard from './BookingCard';

type Props = {
  days: Date[];
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
};

export default function TimeGrid({ days, bookings, onBookingClick }: Props) {
  const getBooking = (date: Date, time: string) => {
    const dateString = date.toISOString().split('T')[0];

    return bookings.find((booking) => booking.date === dateString && booking.startTime === time);
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="grid grid-cols-[72px_repeat(7,minmax(110px,1fr))] sm:grid-cols-[82px_repeat(7,minmax(120px,1fr))]"
          >
            {/* TIME */}
            <div className="relative flex min-h-[82px] items-start justify-center border-b border-r border-[#E5EAE6] bg-[#FAFBF9] pt-3">
              <span className="text-[10px] font-semibold text-[#7D8983]">{time}</span>
            </div>

            {/* DAYS */}
            {days.map((day) => {
              const booking = getBooking(day, time);

              return (
                <div
                  key={`${day.toISOString()}-${time}`}
                  className="relative min-h-[82px] border-b border-r border-[#E5EAE6] bg-white last:border-r-0"
                >
                  {booking && (
                    <BookingCard booking={booking} onClick={() => onBookingClick(booking)} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
