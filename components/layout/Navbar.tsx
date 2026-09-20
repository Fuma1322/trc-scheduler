import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E9E4] bg-[#F7F8F5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#064E3B] text-white shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
            <CalendarDays size={19} strokeWidth={1.8} />
          </div>

          <div className="leading-none">
            <p className="text-[15px] font-bold tracking-tight text-[#17201C]">TRC</p>

            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-[#66736C]">
              Event Scheduler
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-[#E4E9E4] bg-white/70 p-1 md:flex">
          <Link
            href="/"
            className="rounded-full bg-[#F0F5F1] px-4 py-2 text-sm font-medium text-[#064E3B]"
          >
            Home
          </Link>

          <Link
            href="/calendar"
            className="rounded-full px-4 py-2 text-sm font-medium text-[#66736C] transition hover:bg-[#F0F5F1] hover:text-[#064E3B]"
          >
            Calendar
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-medium text-[#66736C] transition hover:bg-[#F0F5F1] hover:text-[#064E3B]"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
