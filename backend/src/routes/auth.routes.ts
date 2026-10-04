import { Router } from 'express';

import {
  login,
  me,
} from '../controllers/auth.controller';

import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);

router.get(
  '/me',
  authenticateAdmin,
  me
);

export default router;