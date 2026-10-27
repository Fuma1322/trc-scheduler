import { Router } from 'express';
import {
  listPayments,
  updatePaymentStatus,
} from '../controllers/payment.controller';

const router = Router();

router.get('/', listPayments);
router.patch('/:id/status', updatePaymentStatus);

export default router;
