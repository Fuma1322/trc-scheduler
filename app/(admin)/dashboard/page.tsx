import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, CreditCard, Users2 } from 'lucide-react';

const stats = [
  {
    label: 'Total Bookings',
    value: '48',
    description: 'All booking requests',
    icon: CalendarDays,
  },
  {
    label: 'Pending',
    value: '7',
    description: 'Need verification',
    icon: Clock3,
  },
  {
    label: 'Paid',
    value: '34',
    description: 'Confirmed bookings',
    icon: CheckCircle2,
  },
  {
    label: 'Customers',
    value: '41',
    description: 'Unique customers',
    icon: Users2,
  },
];

const upcomingBookings = [
  {
    name: 'Mpho Mokoena',
    purpose: 'Wedding',
    date: '24 Sep 2026',
    time: '10:00 – 16:00',
    status: 'Paid',
  },
  {
    name: 'Thabiso Molapo',
    purpose: 'Workshop',
    date: '26 Sep 2026',
    time: '08:00 – 13:00',
    status: 'Paid',
  },
  {
    name: 'Lerato Nthunya',
    purpose: 'Birthday',
    date: '27 Sep 2026',
    time: '14:00 – 18:00',
    status: 'Pending',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#047857]">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17201C]">
            Good morning, Administrator.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#7A8580]">
            Here is what&apos;s happening with the TRC Hall today.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#E4E9E4] bg-white px-3.5 py-2.5">
          <span className="h-2 w-2 rounded-full bg-[#10B981]" />

          <span className="text-xs font-medium text-[#53605A]">System operational</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-[0_6px_25px_rgba(6,78,59,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(6,78,59,0.07)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                  <Icon size={19} strokeWidth={1.8} />
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-[#B1BBB6] transition group-hover:text-[#047857]"
                />
              </div>

              <p className="mt-5 text-2xl font-bold tracking-tight text-[#17201C]">{stat.value}</p>

              <p className="mt-1 text-xs font-semibold text-[#53605A]">{stat.label}</p>

              <p className="mt-1 text-[10px] text-[#9AA49F]">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* ATTENTION CARD */}
      <div className="rounded-2xl border border-[#FDE7C2] bg-[#FFFBF4] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#B45309]">
              <CreditCard size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#17201C]">
                7 bookings need payment verification
              </p>

              <p className="mt-1 text-xs leading-5 text-[#7A8580]">
                Review the submitted M-Pesa codes before confirming these bookings.
              </p>
            </div>
          </div>

          <a
            href="/dashboard/bookings?status=pending"
            className="inline-flex items-center justify-center rounded-xl bg-[#064E3B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#053F30]"
          >
            Review bookings
          </a>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* UPCOMING BOOKINGS */}
        <div className="rounded-2xl border border-[#E4E9E4] bg-white">
          <div className="flex items-center justify-between border-b border-[#E8ECE9] px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-bold text-[#17201C]">Upcoming bookings</p>

              <p className="mt-1 text-[10px] text-[#9AA49F]">Confirmed and pending events</p>
            </div>

            <a
              href="/dashboard/bookings"
              className="text-[11px] font-semibold text-[#047857] hover:underline"
            >
              View all
            </a>
          </div>

          <div className="divide-y divide-[#EEF1EF]">
            {upcomingBookings.map((booking) => (
              <div
                key={`${booking.name}-${booking.date}`}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div>
                  <p className="text-sm font-semibold text-[#26332D]">{booking.name}</p>

                  <p className="mt-1 text-[11px] text-[#8A958F]">
                    {booking.purpose} · {booking.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-medium text-[#66736C]">{booking.time}</span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                      booking.status === 'Paid'
                        ? 'bg-[#ECFDF5] text-[#047857]'
                        : 'bg-[#FFF7E8] text-[#B45309]'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-2xl border border-[#E4E9E4] bg-white p-5 sm:p-6">
          <p className="text-sm font-bold text-[#17201C]">Quick actions</p>

          <p className="mt-1 text-[10px] text-[#9AA49F]">Common administration tasks</p>

          <div className="mt-5 space-y-2.5">
            <a
              href="/dashboard/bookings?status=pending"
              className="flex items-center justify-between rounded-xl border border-[#E4E9E4] px-4 py-3 transition hover:border-[#A7F3D0] hover:bg-[#F7FCF9]"
            >
              <span className="text-xs font-semibold text-[#53605A]">Review pending payments</span>

              <ArrowUpRight size={15} className="text-[#047857]" />
            </a>

            <a
              href="/calendar"
              className="flex items-center justify-between rounded-xl border border-[#E4E9E4] px-4 py-3 transition hover:border-[#A7F3D0] hover:bg-[#F7FCF9]"
            >
              <span className="text-xs font-semibold text-[#53605A]">View public calendar</span>

              <ArrowUpRight size={15} className="text-[#047857]" />
            </a>

            <a
              href="/dashboard/bookings"
              className="flex items-center justify-between rounded-xl border border-[#E4E9E4] px-4 py-3 transition hover:border-[#A7F3D0] hover:bg-[#F7FCF9]"
            >
              <span className="text-xs font-semibold text-[#53605A]">Manage bookings</span>

              <ArrowUpRight size={15} className="text-[#047857]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
