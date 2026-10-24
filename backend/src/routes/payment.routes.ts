import { Router } from 'express';
import { listPayments, updatePaymentStatus } from '../services/admin.service';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: await listPayments(
        typeof req.query.status === 'string' ? req.query.status : undefined,
      ),
    });
  } catch (error) {
    console.error('Payments error:', error);
    res.status(500).json({ success: false, message: 'Could not load payments.' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const email = req.admin?.email ?? 'unknown-admin';
    const result = await updatePaymentStatus(
      req.params.id,
      req.body?.status,
      email,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update payment.';
    const status = message === 'Booking not found.' ? 404 : 400;
    res.status(status).json({ success: false, message });
  }
});

export default router;
