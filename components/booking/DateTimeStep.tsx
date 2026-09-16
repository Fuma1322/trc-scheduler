'use client';

import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { TIME_SLOTS } from '@/lib/constants';

type Props = {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startingDay = firstDay.getDay();

  return {
    daysInMonth,
    startingDay,
  };
}

export default function DateTimeStep({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
}: Props) {
  const today = new Date();

  const { daysInMonth, startingDay } = getMonthDays(today);

  const days = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  );

  const isSelected = (day: number) => {
    if (!selectedDate) return false;

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">
          Step 2
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          Choose your date & time
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#66736C]">
          Select a date and an available time slot for your event.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Calendar */}
        <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7A857F]">
                Select a date
              </p>

              <h2 className="mt-1 font-semibold text-[#17201C]">
                {today.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#064E3B]">
              <CalendarDays size={18} />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
              (day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="py-2 text-[11px] font-semibold text-[#8A958F]"
                >
                  {day}
                </div>
              )
            )}

            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => {
              const date = new Date(
                today.getFullYear(),
                today.getMonth(),
                day
              );

              const past =
                date <
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );

              return (
                <button
                  key={day}
                  type="button"
                  disabled={past}
                  onClick={() => onDateChange(date)}
                  className={[
                    'aspect-square rounded-xl text-sm transition',
                    past
                      ? 'cursor-not-allowed text-[#D0D6D2]'
                      : isSelected(day)
                        ? 'bg-[#064E3B] font-semibold text-white'
                        : 'text-[#39443F] hover:bg-[#ECFDF5] hover:text-[#064E3B]',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time */}
        <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs text-[#7A857F]">
              Available times
            </p>

            <h2 className="mt-1 font-semibold text-[#17201C]">
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })
                : 'Select a date first'}
            </h2>
          </div>

          <div className="grid gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                disabled={!selectedDate}
                onClick={() => onTimeChange(slot)}
                className={[
                  'flex items-center justify-between rounded-xl border px-4 py-4 text-left transition',
                  selectedTime === slot
                    ? 'border-[#047857] bg-[#ECFDF5] text-[#064E3B]'
                    : 'border-[#E4E9E4] text-[#39443F] hover:border-[#B7D8CA]',
                  !selectedDate && 'cursor-not-allowed opacity-40',
                ].join(' ')}
              >
                <span className="text-sm font-medium">
                  {slot}
                </span>

                <span className="text-xs text-[#047857]">
                  Available
                </span>
              </button>
            ))}
          </div>
        </div>
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
          disabled={!selectedDate || !selectedTime}
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#075F48] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}