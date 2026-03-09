import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/authenticate';
import { sendMail, getSentMails } from './mail.service';
import { createError } from '../../utils/createError';

export const sendMailController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { to, subject, html, cc, bcc } = req.body;

        if (!to || !subject || !html) {
            return next(createError('to, subject, and html are required', 400));
        }

        await sendMail(
            { to, subject, html, cc, bcc },
            { id: req.user!.id, name: req.user!.name }
        );

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
        next(err);
    }
};

export const getSentMailsController = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const mails = await getSentMails();
        res.status(200).json({
            success: true,
            mails: mails.map((m) => ({
                id: m._id,
                to: m.to,
                subject: m.subject,
                sentBy: m.sentByName,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sentAt: (m as any).createdAt,
            })),
        });
    } catch (err) {
        next(err);
    }
};
