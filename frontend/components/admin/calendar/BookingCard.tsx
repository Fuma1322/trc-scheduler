'use client';

import { Clock3 } from 'lucide-react';
import type { Booking } from '../../../lib/calendar-data';

type Props = {
  booking: Booking;
  onClick: () => void;
};

export default function BookingCard({ booking, onClick }: Props) {
  const statusStyles = {
    confirmed: 'border-[#A7F3D0] bg-[#ECFDF5]',
    pending: 'border-[#FDE68A] bg-[#FFFBEB]',
    cancelled: 'border-[#E5E7EB] bg-[#F9FAFB]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group absolute inset-x-1 top-1 z-10 min-h-[72px] overflow-hidden rounded-xl border p-2.5 text-left shadow-[0_3px_12px_rgba(6,78,59,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(6,78,59,0.12)] ${statusStyles[booking.status]} `}
    >
      <div className="truncate text-[11px] font-bold text-[#17201C]">{booking.purpose}</div>

      <div className="mt-1 truncate text-[10px] font-medium text-[#65716B]">
        {booking.customerName}
      </div>

      <div className="mt-2 flex items-center gap-1 text-[9px] font-medium text-[#8A958F]">
        <Clock3 size={10} />
        {booking.startTime} – {booking.endTime}
      </div>

      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#047857] opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
