'use client';

import { Check, Clock3, LockKeyhole } from 'lucide-react';

import type { DayAvailability } from './calendar-data';

type Props = {
  selectedDate: Date | null;
  availability: DayAvailability | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
};

export default function AvailabilitySlots({
  selectedDate,
  availability,
  selectedTime,
  onSelectTime,
}: Props) {
  if (!selectedDate) {
    return (
      <div className="rounded-2xl border border-dashed border-[#DCE4DF] bg-[#FAFBF9] p-6 text-center">
        <Clock3 size={20} className="mx-auto text-[#A0AAA5]" />

        <p className="mt-3 text-sm font-semibold text-[#53605A]">Select a date</p>

        <p className="mt-1 text-xs text-[#929D97]">Available booking times will appear here.</p>
      </div>
    );
  }

  const dateLabel = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div>
      <div className="mb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#9AA49F]">
          Selected date
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-[#17201C]">{dateLabel}</h2>
      </div>

      {!availability ? (
        <div className="rounded-2xl border border-[#E5EAE6] bg-[#FAFBF9] p-6 text-center">
          <LockKeyhole size={20} className="mx-auto text-[#9AA49F]" />

          <p className="mt-3 text-sm font-semibold text-[#53605A]">No availability information</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {availability.slots.map((slot) => {
            const available = slot.status === 'available';

            const selected = selectedTime === slot.time;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={!available}
                onClick={() => onSelectTime(slot.time)}
                className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-all ${
                  selected
                    ? 'border-[#047857] bg-[#064E3B] text-white shadow-sm'
                    : available
                      ? 'border-[#E1E8E3] bg-white text-[#34403A] hover:border-[#A7F3D0] hover:bg-[#ECFDF5]'
                      : 'cursor-not-allowed border-[#ECEFEC] bg-[#F7F8F6] text-[#A6AEAA]'
                } `}
              >
                <div className="flex items-center gap-2">
                  <Clock3 size={14} strokeWidth={1.8} />

                  <span className="text-xs font-semibold">{slot.time}</span>
                </div>

                {selected && <Check size={14} />}

                {!available && <span className="text-[8px] font-medium">Booked</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
