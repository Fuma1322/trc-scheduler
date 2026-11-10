import { Router } from 'express';
import { getDashboard } from '../services/admin.service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    res.json({ success: true, data: await getDashboard() });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Could not load dashboard.' });
  }
});

export default router;
