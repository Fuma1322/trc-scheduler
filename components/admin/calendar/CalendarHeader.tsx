'use client';

import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

type Props = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarHeader({ monthLabel, onPrevious, onNext, onToday }: Props) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#E5EAE6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
          <CalendarDays size={19} strokeWidth={2} />
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9AA49F]">
            TRC Hall
          </p>

          <h1 className="text-lg font-bold tracking-tight text-[#17201C]">Calendar</h1>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onToday}
          className="rounded-xl border border-[#E5EAE6] bg-white px-3.5 py-2 text-xs font-semibold text-[#53605A] transition hover:border-[#A7F3D0] hover:bg-[#ECFDF5] hover:text-[#047857]"
        >
          Today
        </button>

        <div className="flex items-center rounded-xl border border-[#E5EAE6] bg-white p-1">
          <button
            type="button"
            onClick={onPrevious}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7E8983] transition hover:bg-[#F7F8F6] hover:text-[#047857]"
            aria-label="Previous week"
          >
            <ChevronLeft size={17} />
          </button>

          <div className="min-w-[145px] px-3 text-center text-sm font-semibold text-[#17201C]">
            {monthLabel}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7E8983] transition hover:bg-[#F7F8F6] hover:text-[#047857]"
            aria-label="Next week"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
