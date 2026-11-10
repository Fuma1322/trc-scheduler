import { Router } from 'express';
import { listCalendar } from '../services/admin.service';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const start = typeof req.query.start === 'string' ? req.query.start : '';
    const end = typeof req.query.end === 'string' ? req.query.end : '';

    res.json({ success: true, data: await listCalendar(start, end) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load calendar.';
    res.status(400).json({ success: false, message });
  }
});

export default router;
