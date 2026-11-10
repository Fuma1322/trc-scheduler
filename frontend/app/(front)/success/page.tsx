import BookingSuccess from '@/components/booking/BookingSuccess';

type SuccessPageProps = {
  searchParams: {
    reference?: string;
    activity?: string;
    dates?: string;
    startTime?: string;
    endTime?: string;
    amount?: string;
    status?: string;
    paymentStatus?: string;
  };
};

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  return (
    <BookingSuccess
      reference={searchParams.reference}
      activity={searchParams.activity}
      dates={searchParams.dates}
      startTime={searchParams.startTime}
      endTime={searchParams.endTime}
      amount={searchParams.amount}
      status={searchParams.status}
      paymentStatus={searchParams.paymentStatus}
    />
  );
}
