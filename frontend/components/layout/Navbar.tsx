'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLinks = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/calendar',
      label: 'Calendar',
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
    },
  ];

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
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#ECFDF5] text-[#064E3B] shadow-sm'
                    : 'text-[#66736C] hover:bg-[#F0F5F1] hover:text-[#064E3B]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
