import { Router } from 'express';
import { login, getMe, changePassword } from './auth.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me
router.get('/me', authenticate, getMe);

// POST /api/v1/auth/change-password  (requires auth — user must be logged in with temp pass)
router.post('/change-password', authenticate, changePassword);

export default router;
