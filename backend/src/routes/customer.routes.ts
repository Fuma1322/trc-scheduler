import { Router } from 'express';
import { listCustomers } from '../services/admin.service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    res.json({ success: true, data: await listCustomers() });
  } catch (error) {
    console.error('Customers error:', error);
    res.status(500).json({ success: false, message: 'Could not load customers.' });
  }
});

export default router;
