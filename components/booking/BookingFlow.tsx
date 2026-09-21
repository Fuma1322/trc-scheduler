'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import BookingProgress from './BookingProgress';
import BookingSummary from './BookingSummary';
import ActivityStep from './ActivityStep';
import DateTimeStep from './DateTimeStep';
import PaymentStep from './PaymentStep';
import DetailsStep from './DetailsStep';

import { initialBookingData, type BookingData, type BookingStep } from '@/lib/booking';

export default function BookingFlow() {
  const router = useRouter();

  const [step, setStep] = useState<BookingStep>('activity');

  const [booking, setBooking] = useState<BookingData>(initialBookingData);

  function updateBooking<K extends keyof BookingData>(field: K, value: BookingData[K]) {
    setBooking((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submitBooking() {
    /*
     * Later:
     * 1. Validate availability
     * 2. Save booking to Prisma
     * 3. Generate booking reference
     * 4. Send WhatsApp confirmation
     */

    router.push('/success');
  }

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <BookingProgress currentStep={step} />

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* MAIN BOOKING AREA */}
          <section>
            {/* ACTIVITY */}
            {step === 'activity' && (
              <ActivityStep
                selected={booking.activity}
                onSelect={(value) => updateBooking('activity', value)}
                onContinue={() => setStep('datetime')}
              />
            )}

            {/* DATE & TIME */}
            {step === 'datetime' && (
              <DateTimeStep
                selectedDates={booking.dates}
                durationType={booking.durationType}
                halfDay={booking.halfDay}
                startTime={booking.startTime}
                endTime={booking.endTime}

                onDatesChange={(value) => updateBooking('dates', value)}

                onDurationChange={(value) => updateBooking('durationType', value)}

                onHalfDayChange={(value) => updateBooking('halfDay', value)}

                onStartTimeChange={(value) => updateBooking('startTime', value)}

                onEndTimeChange={(value) => updateBooking('endTime', value)}

                onBack={() => setStep('activity')}

                onContinue={() => setStep('payment')}
              />
            )}

            {/* PAYMENT */}
            {step === 'payment' && (
              <PaymentStep
                paymentReference={booking.paymentReference}

                onPaymentReferenceChange={(value) => updateBooking('paymentReference', value)}

                onBack={() => setStep('datetime')}

                onContinue={() => setStep('details')}
              />
            )}

            {/* CUSTOMER DETAILS */}
            {step === 'details' && (
              <DetailsStep
                fullName={booking.fullName}
                phone={booking.phone}
                whatsapp={booking.whatsapp}
                notes={booking.notes}

                onChange={(field, value) => updateBooking(field, value)}

                onBack={() => setStep('payment')}

                onSubmit={submitBooking}
              />
            )}
          </section>

          {/* BOOKING SUMMARY */}
          <div className="hidden lg:block">
            <BookingSummary booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
}
