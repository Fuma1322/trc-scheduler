import { Router } from 'express';
import { checkAvailability, createBooking } from '../services/booking.service';

const router = Router();

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

router.post('/availability', async (req, res) => {
  try {
    const result = await checkAvailability(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.post('/', async (req, res) => {
  try {
    const booking = await createBooking(req.body);
    return res.status(201).json({
      message: 'Booking request received. Payment and booking confirmation are still pending.',
      booking,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    const conflict = message.includes('just been booked');
    return res.status(conflict ? 409 : 400).json({ error: message });
  }
});

export default router;
