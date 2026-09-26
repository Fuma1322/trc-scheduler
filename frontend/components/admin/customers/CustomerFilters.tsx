'use client';

import { Search, X } from 'lucide-react';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function CustomerFilters({ search, onSearchChange }: Props) {
  return (
    <div className="border-b border-[#E4E9E4] p-4 sm:p-5">
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
          placeholder="Search customers..."
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
    </div>
  );
}
