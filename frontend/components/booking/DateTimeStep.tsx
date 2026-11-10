
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { BOOKING_DURATIONS, HALF_DAY_SLOTS, BOOKING_HOURS } from '@/lib/constants';
import type { DayAvailability } from '@/components/calendar/calendar-data';

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

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Load live availability whenever the displayed month changes.
  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailability() {
      setLoading(true);
      setError('');
      setAvailability([]);

      try {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const baseUrl = (
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        ).replace(/\/+$/, '');

        const response = await fetch(
          `${baseUrl}/api/bookings/availability?start=${formatDate(firstDay)}&end=${formatDate(lastDay)}`,
          {
            signal: controller.signal,
            cache: 'no-store',
          },
        );

        const result = await response.json();

        if (
          !response.ok ||
          result.success !== true ||
          !Array.isArray(result.data)
        ) {
          throw new Error(
            result.message || 'Unable to load booking availability.',
          );
        }

        setAvailability(result.data as DayAvailability[]);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load booking availability.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => controller.abort();
  }, [year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = new Date(year, month, 1).getDay();

  const availabilityForDate = (date: Date) =>
    availability.find((item) => item.date === formatDate(date));

  const toggleDate = (date: Date) => {
    const exists = selectedDates.some((selected) =>
      isSameDay(selected, date),
    );

    if (exists) {
      onDatesChange(
        selectedDates.filter((selected) => !isSameDay(selected, date)),
      );
      return;
    }

    onDatesChange([...selectedDates, date]);
  };

  const isSelected = (date: Date) =>
    selectedDates.some((selected) => isSameDay(selected, date));

  const changeMonth = (amount: number) => {
    setCurrentMonth(
      new Date(year, month + amount, 1),
    );
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const isComplete =
    selectedDates.length > 0 &&
    durationType !== null &&
    (durationType === 'full-day' ||
      (durationType === 'half-day' && halfDay !== null) ||
      (durationType === 'custom' &&
        startTime !== null &&
        endTime !== null));

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
        {/* LEFT: CALENDAR */}
        <div>
          <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-7">
            {/* MONTH NAVIGATION */}
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#7A857F]">Select date(s)</p>

                <h2 className="mt-1 font-semibold text-[#17201C]">
                  {monthLabel}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-lg border border-[#E4E9E4] px-3 py-2 text-xs font-medium text-[#53605A] transition hover:bg-[#ECFDF5]"
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  aria-label="Previous month"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E9E4] text-[#53605A] transition hover:bg-[#ECFDF5] hover:text-[#047857]"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E9E4] text-[#53605A] transition hover:bg-[#ECFDF5] hover:text-[#047857]"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>

            {/* LOADING / ERROR */}
            {loading && (
              <p role="status" className="mb-4 text-center text-xs text-[#7A857F]">
                Loading live availability...
              </p>
            )}

            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              >
                {error}

                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(year, month, 1))}
                  className="ml-2 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* WEEKDAYS */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
                (day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="py-2 text-[11px] font-semibold text-[#8A958F]"
                  >
                    {day}
                  </div>
                ),
              )}

              {/* EMPTY CELLS */}
              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {/* MONTH DAYS */}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const date = new Date(year, month, index + 1);
                const dateAvailability = availabilityForDate(date);

                const isPast =
                  date <
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                  );

                const selected = isSelected(date);
                const isToday = isSameDay(date, today);
                const isFull = dateAvailability?.status === 'full';

                const unavailable =
                  loading ||
                  !!error ||
                  isPast ||
                  !dateAvailability ||
                  isFull;

                return (
                  <button
                    key={formatDate(date)}
                    type="button"
                    disabled={unavailable && !selected}
                    onClick={() => {
                      if (selected || !unavailable) toggleDate(date);
                    }}
                    title={
                      isPast
                        ? 'Past date'
                        : loading
                          ? 'Loading availability'
                          : isFull
                            ? 'Fully booked'
                            : dateAvailability?.status === 'limited'
                              ? 'Limited availability'
                              : dateAvailability?.status === 'available'
                                ? 'Available'
                                : 'Availability unavailable'
                    }
                    className={[
                      'relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition',
                      isPast
                        ? 'cursor-not-allowed text-[#D0D6D2]'
                        : selected
                          ? 'bg-[#064E3B] font-semibold text-white shadow-sm'
                          : isFull
                            ? 'cursor-not-allowed bg-[#F3F4F3] text-[#A3ADA8]'
                            : unavailable
                              ? 'cursor-not-allowed text-[#D0D6D2]'
                              : 'text-[#39443F] hover:bg-[#ECFDF5] hover:text-[#064E3B]',
                    ].join(' ')}
                  >
                    <span
                      className={
                        isToday && !selected
                          ? 'font-bold text-[#047857]'
                          : ''
                      }
                    >
                      {date.getDate()}
                    </span>

                    {!isPast && dateAvailability && (
                      <span
                        className={[
                          'mt-1 h-1.5 w-1.5 rounded-full',
                          dateAvailability.status === 'available'
                            ? 'bg-[#10B981]'
                            : dateAvailability.status === 'limited'
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#A3ADA8]',
                          selected ? 'bg-white' : '',
                        ].join(' ')}
                      />
                    )}

                    {selected && (
                      <span className="absolute right-1 top-1">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* LEGEND */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[#E4E9E4] pt-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span className="text-[10px] text-[#7A857F]">Available</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] text-[#7A857F]">Limited</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#A3ADA8]" />
                <span className="text-[10px] text-[#7A857F]">Fully booked</span>
              </div>
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

          {/* BOOKING DURATION */}
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
