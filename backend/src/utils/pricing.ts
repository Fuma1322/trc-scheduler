export const FULL_DAY_FEE = 800;
export const HALF_DAY_FEE = 500;

export function calculateBookingAmount(
  durationType: 'full-day' | 'half-day' | 'custom',
  dateCount: number,
): number | null {
  if (durationType === 'full-day') return dateCount * FULL_DAY_FEE;
  if (durationType === 'half-day') return dateCount * HALF_DAY_FEE;
  return null; // Custom bookings require a quote.
}
