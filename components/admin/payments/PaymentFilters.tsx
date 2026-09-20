'use client';

import { Search, X } from 'lucide-react';

import type { PaymentStatus } from './PaymentsPage';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'ALL' | PaymentStatus;
  onStatusChange: (status: 'ALL' | PaymentStatus) => void;
  counts: Record<'ALL' | PaymentStatus, number>;
};

const filters: {
  value: 'ALL' | PaymentStatus;
  label: string;
}[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'REFUNDED', label: 'Refunded' },
];

export default function PaymentFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  counts,
}: Props) {
  return (
    <div className="space-y-4 border-b border-[#E4E9E4] p-4 sm:p-5">
      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={17}
          strokeWidth={1.8}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A958F]"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search payments..."
          className="h-11 w-full rounded-xl border border-[#E4E9E4] bg-[#F7F8F5] pl-10 pr-10 text-sm text-[#17201C] outline-none transition placeholder:text-[#8A958F] focus:border-[#047857] focus:bg-white focus:ring-4 focus:ring-[#ECFDF5]"
        />

        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A958F] transition hover:text-[#17201C]"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const active = statusFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                active
                  ? 'bg-[#064E3B] text-white shadow-sm'
                  : 'bg-[#F3F6F3] text-[#66736C] hover:bg-[#ECFDF5] hover:text-[#047857]'
              }`}
            >
              {filter.label}

              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active ? 'bg-white/15 text-white' : 'bg-white text-[#8A958F]'
                }`}
              >
                {counts[filter.value]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
