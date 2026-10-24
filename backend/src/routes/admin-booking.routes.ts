import { Router } from 'express';
import { listBookings, updateBookingStatus } from '../services/admin.service';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: await listBookings(
        typeof req.query.status === 'string' ? req.query.status : undefined,
      ),
    });
  } catch (error) {
    console.error('Bookings list error:', error);
    res.status(500).json({ success: false, message: 'Could not load bookings.' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const result = await updateBookingStatus(req.params.id, req.body?.status);
    res.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update booking.';
    const status = message === 'Booking not found.' ? 404 : 400;
    res.status(status).json({ success: false, message });
  }
});

export default router;
