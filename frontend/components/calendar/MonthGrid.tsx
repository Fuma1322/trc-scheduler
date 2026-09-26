'use client';

import type { DayAvailability } from './calendar-data';

type Props = {
  currentDate: Date;
  selectedDate: Date | null;
  availability: DayAvailability[];
  onSelectDate: (date: Date) => void;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function MonthGrid({
  currentDate,
  selectedDate,
  availability,
  onSelectDate,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);

  // Monday = 0
  const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: startingDay + daysInMonth }, (_, index) => {
    if (index < startingDay) {
      return null;
    }

    return new Date(year, month, index - startingDay + 1);
  });

  const getAvailability = (date: Date) => {
    return availability.find((item) => item.date === formatDate(date));
  };

  const isSameDay = (first: Date, second: Date | null) => {
    if (!second) return false;

    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  };

  const today = new Date();

  return (
    <div>
      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 border-b border-[#E5EAE6]">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-[#98A29D]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[76px] border-b border-r border-[#E9EEEB] bg-[#FAFBF9] sm:min-h-[100px]"
              />
            );
          }

          const dayAvailability = getAvailability(date);

          const selected = isSameDay(date, selectedDate);

          const isToday = isSameDay(date, today);

          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast || dayAvailability?.status === 'full'}
              onClick={() => onSelectDate(date)}
              className={`relative flex min-h-[76px] flex-col items-center border-b border-r border-[#E9EEEB] p-2 text-center transition-all sm:min-h-[100px] sm:p-3 ${
                isPast
                  ? 'cursor-not-allowed bg-[#FAFBF9] text-[#C5CCC8]'
                  : selected
                    ? 'bg-[#ECFDF5]'
                    : 'bg-white hover:bg-[#F8FBF9]'
              } `}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isToday
                    ? 'bg-[#064E3B] text-white'
                    : selected
                      ? 'text-[#047857]'
                      : isPast
                        ? 'text-[#B5BDB9]'
                        : 'text-[#34403A]'
                } `}
              >
                {date.getDate()}
              </span>

              {!isPast && dayAvailability && (
                <div className="mt-2 flex flex-col items-center gap-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      dayAvailability.status === 'available'
                        ? 'bg-[#10B981]'
                        : dayAvailability.status === 'limited'
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#A3ADA8]'
                    } `}
                  />

                  <span className="hidden text-[8px] font-medium text-[#89948E] sm:block">
                    {dayAvailability.status === 'available'
                      ? 'Available'
                      : dayAvailability.status === 'limited'
                        ? 'Limited'
                        : 'Full'}
                  </span>
                </div>
              )}

              {selected && (
                <span className="absolute bottom-1.5 h-0.5 w-5 rounded-full bg-[#047857]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
