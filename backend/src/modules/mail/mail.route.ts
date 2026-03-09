import { Router } from 'express';
import { sendMailController, getSentMailsController } from './mail.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// All mail routes require authentication
router.use(authenticate);

// POST /api/v1/mail/send
router.post('/send', sendMailController);

// GET /api/v1/mail/sent
router.get('/sent', getSentMailsController);

export default router;
