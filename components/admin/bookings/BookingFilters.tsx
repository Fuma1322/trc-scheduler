'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

import type { BookingStatus } from './BookingsPage';

type StatusFilter = 'ALL' | BookingStatus;

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  counts: {
    all: number;
    pending: number;
    paid: number;
    rejected: number;
    cancelled: number;
  };
};

export default function BookingFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
}: Props) {
  const filters: {
    value: StatusFilter;
    label: string;
    count: number;
  }[] = [
    {
      value: 'ALL',
      label: 'All',
      count: counts.all,
    },
    {
      value: 'PENDING',
      label: 'Pending',
      count: counts.pending,
    },
    {
      value: 'PAID',
      label: 'Paid',
      count: counts.paid,
    },
    {
      value: 'REJECTED',
      label: 'Rejected',
      count: counts.rejected,
    },
    {
      value: 'CANCELLED',
      label: 'Cancelled',
      count: counts.cancelled,
    },
  ];

  return (
    <div className="rounded-2xl border border-[#E4E9E4] bg-white p-4 shadow-[0_6px_25px_rgba(6,78,59,0.03)] sm:p-5">
      <div className="flex flex-col gap-4">
        {/* SEARCH */}
        <div className="relative w-full">
          <Search
            size={17}
            strokeWidth={1.8}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA49F]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search customer, reference or M-Pesa code..."
            className="h-11 w-full rounded-xl border border-[#E4E9E4] bg-[#FAFBF9] pl-10 pr-4 text-xs text-[#17201C] outline-none transition placeholder:text-[#A0AAA5] focus:border-[#A7F3D0] focus:bg-white focus:ring-2 focus:ring-[#ECFDF5]"
          />
        </div>

        {/* STATUS FILTER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="mr-1 flex shrink-0 items-center gap-2 text-[#8A958F]">
            <SlidersHorizontal size={14} />

            <span className="text-[10px] font-semibold uppercase tracking-wider">Status</span>
          </div>

          {filters.map((filter) => {
            const active = status === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onStatusChange(filter.value)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
                  active
                    ? 'bg-[#064E3B] text-white'
                    : 'border border-[#E4E9E4] bg-white text-[#66736C] hover:bg-[#F7F8F5] hover:text-[#047857]'
                }`}
              >
                {filter.label}

                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                    active ? 'bg-white/15 text-white' : 'bg-[#F1F4F2] text-[#8A958F]'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
