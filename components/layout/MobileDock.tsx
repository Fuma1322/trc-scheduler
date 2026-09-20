'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Grid, Home } from 'lucide-react';

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/calendar',
    label: 'Calendar',
    icon: CalendarDays,
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: Grid,
  },
];

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-around rounded-[22px] border border-[#E4E9E4] bg-white/95 px-2 py-2 shadow-[0_12px_40px_rgba(6,78,59,0.14)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[88px] flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200 ${
                isActive
                  ? 'bg-[#ECFDF5] text-[#047857]'
                  : 'text-[#7A857F] hover:bg-[#F7F8F5] hover:text-[#064E3B]'
              } `}
            >
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />

              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'} `}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
