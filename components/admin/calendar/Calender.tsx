'use client';

import { useMemo, useState } from 'react';

import CalendarHeader from './CalendarHeader';
import DateStrip from './DateStrip';
import TimeGrid from './TimeGrid';
import BookingModal from './BookingModal';

import { demoBookings, type Booking } from '../../../lib/calendar-data';

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();

  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);

  result.setHours(0, 0, 0, 0);

  return result;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);

  return result;
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }, [weekStart]);

  const monthLabel = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const goPrevious = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const goNext = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const goToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <>
      <section className="overflow-hidden rounded-[22px] border border-[#E5EAE6] bg-white shadow-[0_8px_35px_rgba(6,78,59,0.05)]">
        {/* HEADER */}
        <CalendarHeader
          monthLabel={monthLabel}
          onPrevious={goPrevious}
          onNext={goNext}
          onToday={goToday}
        />

        {/* DATE STRIP */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <DateStrip
              days={days.map((date) => ({
                date,
                isToday: date.toDateString() === new Date().toDateString(),
                isSelected: date.toDateString() === selectedDate.toDateString(),
              }))}
            />
          </div>
        </div>

        {/* CALENDAR GRID */}
        <TimeGrid days={days} bookings={demoBookings} onBookingClick={setSelectedBooking} />
      </section>

      {/* BOOKING DETAILS */}
      <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </>
  );
}
