'use client';

import { Check } from 'lucide-react';

const steps = [
  { id: 'activity', label: 'Activity' },
  { id: 'datetime', label: 'Date & Time' },
  { id: 'paymentDetails', label: 'Payment Details' },
];

type Props = {
  currentStep: string;
};

export default function BookingProgress({ currentStep }: Props) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="mb-10">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition',
                    completed || active
                      ? 'bg-[#064E3B] text-white'
                      : 'border border-[#DDE5DF] bg-white text-[#7A857F]',
                  ].join(' ')}
                >
                  {completed ? <Check size={14} /> : index + 1}
                </div>

                <span
                  className={[
                    'hidden text-xs font-medium sm:block',
                    active ? 'text-[#064E3B]' : 'text-[#7A857F]',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={['mx-3 h-px flex-1', completed ? 'bg-[#064E3B]' : 'bg-[#E4E9E4]'].join(
                    ' '
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
