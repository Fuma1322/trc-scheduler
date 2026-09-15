'use client';

import Link from 'next/link';
import {
  CalendarDays,
  ClipboardList,
  Home,
  Plus,
} from 'lucide-react';

export default function MobileDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-[#E5DED2] bg-[#FFFDF9]/95 px-3 py-2 shadow-[0_10px_40px_rgba(61,52,43,0.15)] backdrop-blur-xl">
        
        <Link
          href="/"
          className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[#3D342B]"
        >
          <Home size={19} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">
            Home
          </span>
        </Link>

        <Link
          href="/calendar"
          className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[#756451]"
        >
          <CalendarDays size={19} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">
            Calendar
          </span>
        </Link>

        {/* Central Booking Button */}
        <Link
          href="/book"
          className="-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3D342B] text-[#FFFDF9] shadow-lg ring-4 ring-[#F7F4EE]"
          aria-label="Create booking"
        >
          <Plus size={24} strokeWidth={1.8} />
        </Link>

        <Link
          href="/bookings"
          className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[#756451]"
        >
          <ClipboardList size={19} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">
            Bookings
          </span>
        </Link>

        <Link
          href="/book"
          className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[#756451]"
        >
          <Plus size={19} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">
            Book
          </span>
        </Link>
      </nav>
    </div>
  );
}