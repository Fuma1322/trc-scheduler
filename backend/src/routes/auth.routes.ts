import { Router } from 'express';

import {
  login,
  me,
  logout,
  register,
} from '../controllers/auth.controller';

import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);

router.get('/me', authenticateAdmin, me);
router.post('/register', authenticateAdmin, register);

export default router;