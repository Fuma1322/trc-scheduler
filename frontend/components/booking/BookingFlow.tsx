'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import BookingProgress from './BookingProgress';
import BookingSummary from './BookingSummary';
import ActivityStep from './ActivityStep';
import DateTimeStep from './DateTimeStep';
import PaymentDetailsStep from './PaymentDetailsStep';

import {
  initialBookingData,
  type BookingData,
  type BookingStep,
} from '@/lib/booking';

type CreatedBooking = {
  id: string;
  reference: string;
  dates: string[];
  startTime: string;
  endTime: string;
  amount: number | null;
  status: string;
  paymentStatus: string;
};

type CreateBookingResponse = {
  message?: string;
  booking?: CreatedBooking;
  error?: string;
};

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function BookingFlow() {
  const router = useRouter();

  const [step, setStep] = useState<BookingStep>('activity');
  const [booking, setBooking] = useState<BookingData>(initialBookingData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function updateBooking<K extends keyof BookingData>(
    field: K,
    value: BookingData[K],
  ) {
    setBooking((current) => ({
      ...current,
      [field]: value,
    }));

    setSubmitError('');
  }

  async function submitBooking() {
    if (submitting) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const apiBaseUrl = (
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      ).replace(/\/+$/, '');

      const payload = {
        activity: booking.activity,
        dates: booking.dates.map(formatLocalDate),
        durationType: booking.durationType,
        halfDay: booking.durationType === 'half-day' ? booking.halfDay : null,
        startTime: booking.durationType === 'custom' ? booking.startTime : null,
        endTime: booking.durationType === 'custom' ? booking.endTime : null,
        paymentMethod: booking.paymentMethod,
        paymentReference: booking.paymentReference.trim(),
        fullName: booking.fullName.trim(),
        phone: booking.phone.trim(),
        whatsapp: booking.whatsapp.trim(),
        notes: booking.notes.trim(),
      };

      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as CreateBookingResponse;

      if (!response.ok) {
        throw new Error(
          result.error || 'We could not submit your booking. Please try again.',
        );
      }

      if (!result.booking?.reference) {
        throw new Error(
          'The server response did not include a booking reference. Please contact TRC before submitting again.',
        );
      }

      const params = new URLSearchParams({
        reference: result.booking.reference,
        activity: booking.activity || '',
        dates: result.booking.dates.join(','),
        startTime: result.booking.startTime,
        endTime: result.booking.endTime,
        amount:
          result.booking.amount === null
            ? 'quote'
            : String(result.booking.amount),
        status: result.booking.status,
        paymentStatus: result.booking.paymentStatus,
      });

      router.push(`/success?${params.toString()}`);
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? 'Could not connect to the booking server. Check that the backend is running and the API URL is correct.'
          : error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <BookingProgress currentStep={step} />

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <section>
            {step === 'activity' && (
              <ActivityStep
                selected={booking.activity}
                onSelect={(value) => updateBooking('activity', value)}
                onContinue={() => setStep('datetime')}
              />
            )}

            {step === 'datetime' && (
              <DateTimeStep
                selectedDates={booking.dates}
                durationType={booking.durationType}
                halfDay={booking.halfDay}
                startTime={booking.startTime}
                endTime={booking.endTime}
                onDatesChange={(value) => updateBooking('dates', value)}
                onDurationChange={(value) =>
                  updateBooking('durationType', value)
                }
                onHalfDayChange={(value) => updateBooking('halfDay', value)}
                onStartTimeChange={(value) => updateBooking('startTime', value)}
                onEndTimeChange={(value) => updateBooking('endTime', value)}
                onBack={() => setStep('activity')}
                onContinue={() => setStep('payment')}
              />
            )}

            {step === 'payment' && (
              <>
                {submitError && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                  >
                    <p className="font-semibold">Booking not submitted</p>
                    <p className="mt-1">{submitError}</p>
                    <p className="mt-2">
                      If you are unsure whether the request was saved, check
                      with TRC before submitting it again.
                    </p>
                  </div>
                )}

                <PaymentDetailsStep
                  booking={booking}
                  onChange={(field, value) => updateBooking(field, value)}
                  onBack={() => {
                    setSubmitError('');
                    setStep('datetime');
                  }}
                  onSubmit={submitBooking}
                />

                {submitting && (
                  <p
                    role="status"
                    className="mt-4 text-center text-sm text-[#66736C]"
                  >
                    Submitting your booking request…
                  </p>
                )}
              </>
            )}
          </section>

          <div className="hidden lg:block">
            <BookingSummary booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
}
