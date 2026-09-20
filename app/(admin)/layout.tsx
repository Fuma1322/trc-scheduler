'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users2,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/calendar',
      label: 'Calendar',
      icon: CalendarDays,
    },
    {
      href: '/dashboard/bookings',
      label: 'Bookings',
      icon: ClipboardList,
    },
    {
      href: '/dashboard/customers',
      label: 'Customers',
      icon: Users2,
    },
    {
      href: '/dashboard/payments',
      label: 'Payments',
      icon: CreditCard,
    },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen text-[#17201C]">
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[270px] flex-col border-r border-[#E5EAE6] bg-white lg:flex">
        {/* BRAND */}
        <div className="px-6 pb-7 pt-7">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#064E3B] shadow-[0_5px_18px_rgba(6,78,59,0.16)] transition-transform duration-200 group-hover:scale-[1.03]">
              <span className="text-[10px] font-bold tracking-wide text-white">TRC</span>
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-[-0.02em] text-[#17201C]">
                TRC
                <span className="ml-1 text-[#047857]">Admin</span>
              </h1>

              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#98A29D]">
                Event Scheduler
              </p>
            </div>
          </Link>
        </div>

        {/* SUBTLE DIVIDER */}
        <div className="mx-6 h-px bg-[#EEF1EF]" />

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#A0AAA5]">
            Workspace
          </p>

          <nav className="space-y-1">
            {links.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-3 rounded-[13px] px-3.5 py-3 transition-all duration-200 ${
                    active
                      ? 'bg-[#ECFDF5] text-[#064E3B]'
                      : 'text-[#6E7973] hover:bg-[#F7F8F6] hover:text-[#17201C]'
                  } `}
                >
                  {/* ACTIVE RAIL */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#047857]" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={active ? 2.1 : 1.8}
                    className={`shrink-0 transition-colors duration-200 ${
                      active ? 'text-[#047857]' : 'text-[#929D97] group-hover:text-[#047857]'
                    } `}
                  />

                  <span className={`text-[13px] ${active ? 'font-semibold' : 'font-medium'} `}>
                    {link.label}
                  </span>

                  {active && (
                    <ChevronRight size={14} strokeWidth={2} className="ml-auto text-[#047857]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-[#E5EAE6] px-6 py-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#047857]" />
            </span>

            <span className="text-[10px] font-medium text-[#68736D]">System operational</span>
          </div>

          <p className="text-[9px] text-[#A0AAA5]">© {new Date().getFullYear()}</p>

          <p className="mt-0.5 text-[9px] font-semibold text-[#047857]">
            Powered by MPLUG PTY LTD.
          </p>
        </div>
      </aside>

      {/* =========================================================
          MAIN APPLICATION
      ========================================================= */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[270px]">
        {/* =======================================================
            TOP BAR
        ======================================================= */}
        <header className="sticky top-0 z-40 flex h-[68px] shrink-0 items-center justify-between border-b border-[#E5EAE6] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          {/* MOBILE BRAND */}
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#064E3B] shadow-sm">
              <span className="text-[9px] font-bold text-white">TRC</span>
            </div>

            <div>
              <p className="text-[13px] font-bold text-[#17201C]">
                TRC <span className="text-[#047857]">Admin</span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#9AA49F]">
                Event Scheduler
              </p>
            </div>
          </Link>

          {/* DESKTOP PAGE CONTEXT */}
          <div className="hidden lg:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9AA49F]">
              TRC Event Scheduler
            </p>

            <h2 className="mt-0.5 text-sm font-semibold tracking-[-0.01em] text-[#17201C]">
              Control Center
            </h2>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* STATUS */}
            <div className="hidden items-center gap-2 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#047857]" />

              <span className="text-[10px] font-semibold text-[#047857]">Online</span>
            </div>

            {/* DIVIDER */}
            <div className="hidden h-7 w-px bg-[#E5EAE6] sm:block" />

            {/* PROFILE */}
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-xl p-1 transition-colors hover:bg-[#F7F8F6]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#064E3B] text-[11px] font-bold text-white shadow-sm">
                A
              </div>

              <div className="hidden text-left md:block">
                <p className="text-[11px] font-semibold text-[#17201C]">Administrator</p>

                <p className="mt-0.5 text-[9px] text-[#929D97]">TRC Hall</p>
              </div>
            </button>
          </div>
        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 pb-24 sm:px-6 sm:py-7 lg:px-8 lg:py-8 lg:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
      ========================================================= */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5EAE6] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(6,78,59,0.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-all duration-200 ${
                  active ? 'text-[#047857]' : 'text-[#8B9690]'
                } `}
              >
                <div
                  className={`flex h-7 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                    active ? 'bg-[#ECFDF5]' : ''
                  } `}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                </div>

                <span className={`text-[9px] ${active ? 'font-semibold' : 'font-medium'} `}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
