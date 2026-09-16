'use client';

import {
  Cake,
  Flower2,
  GraduationCap,
  Heart,
  Sparkles,
  Users,
  ArrowRight,
} from 'lucide-react';

import { ACTIVITIES } from '@/lib/constants';

const icons = {
  Heart,
  Users,
  GraduationCap,
  Flower2,
  Cake,
  Sparkles,
};

type Props = {
  selected: string | null;
  onSelect: (activity: string) => void;
  onContinue: () => void;
};

export default function ActivityStep({
  selected,
  onSelect,
  onContinue,
}: Props) {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">
          Step 1
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#17201C] sm:text-4xl">
          What are you booking the hall for?
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#66736C]">
          Choose the activity that best describes your event.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITIES.map((activity) => {
          const Icon = icons[
            activity.icon as keyof typeof icons
          ];

          const isSelected = selected === activity.id;

          return (
            <button
              key={activity.id}
              type="button"
              onClick={() => onSelect(activity.id)}
              className={[
                'group min-h-[170px] rounded-2xl border p-6 text-left transition-all duration-200',
                isSelected
                  ? 'border-[#047857] bg-[#ECFDF5] shadow-sm'
                  : 'border-[#E4E9E4] bg-white hover:-translate-y-0.5 hover:border-[#B7D8CA] hover:shadow-sm',
              ].join(' ')}
            >
              <div
                className={[
                  'mb-6 flex h-11 w-11 items-center justify-center rounded-xl transition',
                  isSelected
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-[#F1F5F2] text-[#064E3B] group-hover:bg-[#E5F4ED]',
                ].join(' ')}
              >
                <Icon size={20} strokeWidth={1.7} />
              </div>

              <h2 className="font-semibold text-[#17201C]">
                {activity.name}
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#7A857F]">
                {activity.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={!selected}
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#075F48] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}