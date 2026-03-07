import { Router } from 'express';
import { sendMailController } from './mail.controller';

const router = Router();

/**
 * @route   POST /api/v1/mail/send
 * @desc    Send an email
 * @access  Public (add auth middleware here when ready)
 */
router.post('/send', sendMailController);

export default router;
