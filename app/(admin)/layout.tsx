'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Truck, Users2, Table } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/sales', label: 'Sales', icon: ShoppingCart },
    { href: '/purchases', label: 'Purchases', icon: Truck },
    { href: '/workers', label: 'Workers', icon: Users2 },
    { href: '/tables', label: 'Tables', icon: Table },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* SIDEBAR */}
      <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-neutral-200 bg-white p-6">
        {/* BRAND */}
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#111111]">
              Steward <span className="text-[#25D366]">Admin</span>
            </h1>
          </Link>

          <p className="mt-1 text-xs text-neutral-500">Admin Control Center</p>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const active = pathname.includes(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  active
                    ? 'border border-[#25D366] bg-[#25D366]/10 text-[#111111]'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon size={18} />

                <span className="text-sm font-medium">{link.label}</span>

                {active && <span className="ml-auto h-2 w-2 rounded-full bg-[#25D366]" />}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          © {new Date().getFullYear()}{' '}
          <span className="font-bold text-[#25D366]">Powered by: MPLUG PTY LTD.</span>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
          <h2 className="text-sm font-semibold text-[#111111]">Admin Panel</h2>

          <div className="flex items-center gap-3">
            {/* STATUS DOT */}
            <span className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="h-2 w-2 rounded-full bg-[#25D366]" />
              Online
            </span>

            {/* PROFILE */}
            <div className="h-9 w-9 rounded-full border border-[#25D366] bg-[#25D366]/10" />
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
