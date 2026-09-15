import Link from 'next/link';
import { CalendarDays, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#064E3B] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

        {/* Main */}
        <div className="flex flex-col gap-14 md:flex-row md:items-start md:justify-between">

          {/* Brand */}
          <div className="max-w-md">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#064E3B]">
                <CalendarDays size={20} strokeWidth={1.8} />
              </div>

              <div className="leading-none">
                <p className="text-sm font-bold tracking-wide">
                  TRC
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-[#B8D7CC]">
                  Event Scheduler
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#B8D7CC]">
              A simple and reliable platform for managing
              hall bookings, events and daily availability.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8FBCAD]">
              Navigation
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm text-[#D9EAE4] transition hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                href="/calendar"
                className="text-sm text-[#D9EAE4] transition hover:text-white"
              >
                Calendar
              </Link>

              <Link
                href="/bookings"
                className="text-sm text-[#D9EAE4] transition hover:text-white"
              >
                Bookings
              </Link>

              <Link
                href="/book"
                className="flex items-center gap-1 text-sm text-[#D9EAE4] transition hover:text-white"
              >
                New Booking
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8FBCAD]">
              System
            </p>

            <div className="flex items-center gap-2 text-sm text-[#D9EAE4]">
              <span className="h-2 w-2 rounded-full bg-[#86EFAC]" />
              System operational
            </div>

            <p className="mt-3 text-xs text-[#8FBCAD]">
              TRC Hall Management
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#8FBCAD]">
            © 2026 TRC Event Scheduler
          </p>

          <p className="text-xs text-[#8FBCAD]">
            Built for TRC
          </p>
        </div>
      </div>
    </footer>
  );
}