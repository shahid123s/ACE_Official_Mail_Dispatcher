import { Router } from 'express';
import { login, getMe } from './auth.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me
router.get('/me', authenticate, getMe);

export default router;
