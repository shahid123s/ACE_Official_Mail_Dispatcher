import { Router } from 'express';
import { listUsers, patchUserRole, patchUserActive } from './users.controller';
import { authenticate } from '../../middlewares/authenticate';
import { requireAdmin } from '../../middlewares/requireAdmin';

const router = Router();

// All routes require auth + admin
router.use(authenticate, requireAdmin);

// GET /api/v1/users
router.get('/', listUsers);

// PATCH /api/v1/users/:id/role
router.patch('/:id/role', patchUserRole);

// PATCH /api/v1/users/:id/active
router.patch('/:id/active', patchUserActive);

export default router;
