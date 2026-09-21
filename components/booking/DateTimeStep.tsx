'use client';

import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3 } from 'lucide-react';

import { BOOKING_DURATIONS, HALF_DAY_SLOTS, BOOKING_HOURS } from '@/lib/constants';

type DurationType = 'full-day' | 'half-day' | 'custom';

type Props = {
  selectedDates: Date[];
  durationType: DurationType | null;
  halfDay: 'morning' | 'afternoon' | null;
  startTime: string | null;
  endTime: string | null;

  onDatesChange: (dates: Date[]) => void;
  onDurationChange: (duration: DurationType) => void;
  onHalfDayChange: (halfDay: 'morning' | 'afternoon') => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;

  onBack: () => void;
  onContinue: () => void;
};

function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return {
    daysInMonth,
    startingDay: firstDay.getDay(),
  };
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export default function DateTimeStep({
  selectedDates,
  durationType,
  halfDay,
  startTime,
  endTime,

  onDatesChange,
  onDurationChange,
  onHalfDayChange,
  onStartTimeChange,
  onEndTimeChange,

  onBack,
  onContinue,
}: Props) {
  const today = new Date();

  const { daysInMonth, startingDay } = getMonthDays(today);

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const toggleDate = (date: Date) => {
    const exists = selectedDates.some((selected) => isSameDay(selected, date));

    if (exists) {
      onDatesChange(selectedDates.filter((selected) => !isSameDay(selected, date)));

      return;
    }

    onDatesChange([...selectedDates, date]);
  };

  const isSelected = (date: Date) => {
    return selectedDates.some((selected) => isSameDay(selected, date));
  };

  const isComplete =
    selectedDates.length > 0 &&
    durationType !== null &&
    (durationType === 'full-day' ||
      (durationType === 'half-day' && halfDay !== null) ||
      (durationType === 'custom' && startTime !== null && endTime !== null));

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">
          Step 2
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          Choose your dates & time
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66736C]">
          Select one or more dates, then choose how long you would like to use the hall.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* CALENDAR */}
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7A857F]">Select date(s)</p>

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
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="py-2 text-[11px] font-semibold text-[#8A958F]"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: startingDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {days.map((day) => {
                const date = new Date(today.getFullYear(), today.getMonth(), day);

                const past =
                  date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                const selected = isSelected(date);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={past}
                    onClick={() => toggleDate(date)}
                    className={[
                      'relative aspect-square rounded-xl text-sm transition',
                      past
                        ? 'cursor-not-allowed text-[#D0D6D2]'
                        : selected
                          ? 'bg-[#064E3B] font-semibold text-white shadow-sm'
                          : 'text-[#39443F] hover:bg-[#ECFDF5] hover:text-[#064E3B]',
                    ].join(' ')}
                  >
                    {day}

                    {selected && (
                      <span className="absolute right-1.5 top-1.5">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDates.length > 0 && (
              <div className="mt-5 rounded-xl bg-[#F7F8F5] px-4 py-3">
                <p className="text-xs text-[#66736C]">
                  {selectedDates.length === 1
                    ? '1 date selected'
                    : `${selectedDates.length} dates selected`}
                </p>
              </div>
            )}
          </div>

          {/* DURATION */}
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-7">
            <div className="mb-5">
              <p className="text-xs text-[#7A857F]">Booking duration</p>

              <h2 className="mt-1 font-semibold text-[#17201C]">How long do you need the hall?</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {BOOKING_DURATIONS.map((duration) => {
                const selected = durationType === duration.id;

                return (
                  <button
                    key={duration.id}
                    type="button"
                    onClick={() => onDurationChange(duration.id)}
                    className={[
                      'rounded-xl border p-4 text-left transition',
                      selected
                        ? 'border-[#047857] bg-[#ECFDF5] text-[#064E3B]'
                        : 'border-[#E4E9E4] hover:border-[#B7D8CA]',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between">
                      <Clock3 size={18} />

                      {selected && <Check size={16} />}
                    </div>

                    <p className="mt-4 text-sm font-semibold">{duration.name}</p>

                    <p className="mt-1 text-xs leading-5 text-[#7A857F]">{duration.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* HALF DAY */}
          {durationType === 'half-day' && (
            <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-7">
              <p className="text-xs text-[#7A857F]">Half day session</p>

              <h2 className="mt-1 font-semibold text-[#17201C]">Choose a session</h2>

              <div className="mt-5 grid gap-3">
                {HALF_DAY_SLOTS.map((slot) => {
                  const selected = halfDay === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => onHalfDayChange(slot.id)}
                      className={[
                        'flex items-center justify-between rounded-xl border px-4 py-4 text-left transition',
                        selected
                          ? 'border-[#047857] bg-[#ECFDF5] text-[#064E3B]'
                          : 'border-[#E4E9E4] hover:border-[#B7D8CA]',
                      ].join(' ')}
                    >
                      <div>
                        <p className="text-sm font-semibold">{slot.name}</p>

                        <p className="mt-1 text-xs text-[#7A857F]">{slot.time}</p>
                      </div>

                      {selected && <Check size={17} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CUSTOM HOURS */}
          {durationType === 'custom' && (
            <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-7">
              <p className="text-xs text-[#7A857F]">Custom hours</p>

              <h2 className="mt-1 font-semibold text-[#17201C]">Choose your hours</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-[#66736C]">Start time</span>

                  <select
                    value={startTime ?? ''}
                    onChange={(e) => onStartTimeChange(e.target.value)}
                    className="w-full rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#047857]"
                  >
                    <option value="">Select start time</option>

                    {BOOKING_HOURS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-[#66736C]">End time</span>

                  <select
                    value={endTime ?? ''}
                    onChange={(e) => onEndTimeChange(e.target.value)}
                    className="w-full rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#047857]"
                  >
                    <option value="">Select end time</option>

                    {BOOKING_HOURS.map((time) => (
                      <option
                        key={time}
                        value={time}
                        disabled={startTime !== null && time <= startTime}
                      >
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {startTime && endTime && (
                <div className="mt-5 rounded-xl bg-[#F7F8F5] px-4 py-3">
                  <p className="text-xs text-[#66736C]">Your booking</p>

                  <p className="mt-1 text-sm font-semibold text-[#17201C]">
                    {startTime} — {endTime}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SUMMARY */}
          <div className="rounded-2xl bg-[#064E3B] p-5 text-white sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A7F3D0]">
              Booking summary
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-[#A7F3D0]">Dates</p>

                <p className="mt-1 text-sm font-medium">
                  {selectedDates.length === 0
                    ? 'No dates selected'
                    : selectedDates
                        .map((date) =>
                          date.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                          })
                        )
                        .join(', ')}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#A7F3D0]">Duration</p>

                <p className="mt-1 text-sm font-medium">
                  {durationType === 'full-day' && 'Full Day'}

                  {durationType === 'half-day' &&
                    halfDay &&
                    `${halfDay === 'morning' ? 'Morning' : 'Afternoon'} Half Day`}

                  {durationType === 'custom' && startTime && endTime && `${startTime} — ${endTime}`}

                  {!durationType && 'Not selected'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
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
          disabled={!isComplete}
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
