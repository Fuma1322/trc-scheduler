'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

import CalendarHeader from './CalendarHeader';
import MonthGrid from './MonthGrid';
import AvailabilitySlots from './AvailabilitySlots';

import { availability } from './calendar-data';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function AvailabilityCalendar() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedAvailability = useMemo(() => {
    if (!selectedDate) return null;

    return availability.find((item) => item.date === formatDate(selectedDate)) ?? null;
  }, [selectedDate]);

  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const goPrevious = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    setSelectedDate(null);
    setSelectedTime(null);
  };

  const goNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    setSelectedDate(null);
    setSelectedTime(null);
  };

  const goToday = () => {
    const today = new Date();

    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBook = () => {
    if (!selectedDate) return;

    const date = formatDate(selectedDate);

    const params = new URLSearchParams();

    params.set('date', date);

    if (selectedTime) {
      params.set('time', selectedTime);
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      {/* INTRO */}
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#064E3B] text-white shadow-[0_8px_25px_rgba(6,78,59,0.15)]">
          <span className="text-[9px] font-bold tracking-wide">TRC</span>
        </div>

        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#047857]">
          Hall availability
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#17201C] sm:text-3xl">
          Find a date that works for you.
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#718079]">
          Check available dates and times for the TRC Hall before starting your booking.
        </p>
      </div>

      {/* CALENDAR CARD */}
      <section className="overflow-hidden rounded-[24px] border border-[#E4EAE6] bg-white shadow-[0_12px_45px_rgba(6,78,59,0.06)]">
        <div className="p-4 sm:p-6 lg:p-7">
          <CalendarHeader
            month={monthLabel}
            onPrevious={goPrevious}
            onNext={goNext}
            onToday={goToday}
          />

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#E5EAE6]">
            <MonthGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              availability={availability}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            />
          </div>

          {/* LEGEND */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-medium text-[#7D8983]">Available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <span className="text-[10px] font-medium text-[#7D8983]">Limited</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#A3ADA8]" />
              <span className="text-[10px] font-medium text-[#7D8983]">Fully booked</span>
            </div>
          </div>
        </div>

        {/* SELECTED DATE */}
        <div className="border-t border-[#E5EAE6] bg-[#FAFBF9] p-4 sm:p-6 lg:p-7">
          <AvailabilitySlots
            selectedDate={selectedDate}
            availability={selectedAvailability}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />

          {/* BOOK CTA */}
          {selectedDate && (
            <div className="mt-6 border-t border-[#E5EAE6] pt-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    <Info size={15} className="text-[#047857]" />
                  </div>

                  <p className="max-w-md text-[10px] leading-5 text-[#7B8781]">
                    Availability can change. Your booking is only confirmed once the booking process
                    and payment requirements have been completed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBook}
                  className="group flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-5 py-3 text-xs font-semibold text-white shadow-[0_8px_22px_rgba(6,78,59,0.15)] transition hover:bg-[#053F30] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedAvailability}
                >
                  Book This Date
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
