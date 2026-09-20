'use client';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  month: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarHeader({ month, onPrevious, onNext, onToday }: Props) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#047857]">
          <CalendarDays size={20} strokeWidth={1.9} />
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#98A29D]">TRC Hall</p>

          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-[#17201C]">Availability</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToday}
          className="rounded-xl border border-[#E3E9E5] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#53605A] transition hover:border-[#A7F3D0] hover:bg-[#ECFDF5] hover:text-[#047857]"
        >
          Today
        </button>

        <div className="flex items-center rounded-xl border border-[#E3E9E5] bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={onPrevious}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7E8983] transition hover:bg-[#F3F6F3] hover:text-[#047857]"
            aria-label="Previous month"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="min-w-[135px] px-2 text-center text-sm font-semibold text-[#17201C]">
            {month}
          </span>

          <button
            type="button"
            onClick={onNext}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7E8983] transition hover:bg-[#F3F6F3] hover:text-[#047857]"
            aria-label="Next month"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
