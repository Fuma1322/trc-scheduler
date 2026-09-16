'use client';

type Day = {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
};

type Props = {
  days: Day[];
};

export default function DateStrip({ days }: Props) {
  return (
    <div className="grid grid-cols-[72px_repeat(7,minmax(110px,1fr))] border-b border-[#E5EAE6] bg-white sm:grid-cols-[82px_repeat(7,minmax(120px,1fr))]">
      <div className="flex items-center justify-center border-r border-[#E5EAE6] bg-[#FAFBF9]">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A0AAA5]">
          Time
        </span>
      </div>

      {days.map((day) => {
        const weekday = day.date.toLocaleDateString('en-US', {
          weekday: 'short',
        });

        const dateNumber = day.date.getDate();

        return (
          <div
            key={day.date.toISOString()}
            className={`relative flex min-h-[72px] flex-col items-center justify-center border-r border-[#E5EAE6] last:border-r-0 ${
              day.isSelected ? 'bg-[#ECFDF5]' : 'bg-white'
            } `}
          >
            <span
              className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
                day.isSelected ? 'text-[#047857]' : 'text-[#9AA49F]'
              } `}
            >
              {weekday}
            </span>

            <span
              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                day.isToday
                  ? 'bg-[#064E3B] text-white shadow-sm'
                  : day.isSelected
                    ? 'text-[#047857]'
                    : 'text-[#34403A]'
              } `}
            >
              {dateNumber}
            </span>

            {day.isToday && (
              <span className="absolute bottom-2 h-1 w-1 rounded-full bg-[#34D399]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
