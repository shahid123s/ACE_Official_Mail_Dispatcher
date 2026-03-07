import { Request, Response, NextFunction } from 'express';
import { sendMail } from './mail.service';
import { createError } from '../../utils/createError';

export const sendMailController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { to, subject, html, cc, bcc } = req.body;

        if (!to || !subject || !html) {
            return next(createError('to, subject, and html are required fields', 400));
        }

        await sendMail({ to, subject, html, cc, bcc });

        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};
