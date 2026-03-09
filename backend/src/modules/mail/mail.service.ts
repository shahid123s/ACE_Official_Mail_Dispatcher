import nodemailer from 'nodemailer';
import { ENV } from '../../config/env';
import { createError } from '../../utils/createError';
import SentMail from '../../models/SentMail';

export interface SendMailOptions {
    to: string | string[];
    cc?: string;
    bcc?: string;
    subject: string;
    html: string;
}

export interface Sender {
    id: string;
    name: string;
}

const getTransporter = () =>
    nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: ENV.SMTP_PORT,
        secure: ENV.SMTP_PORT === 465,
        auth: {
            user: ENV.SMTP_USER,
            pass: ENV.SMTP_PASS,
        },
    });

export const sendMail = async (
    options: SendMailOptions,
    sender: Sender
): Promise<void> => {
    if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) {
        throw createError('SMTP configuration is missing. Check your backend .env file.', 500);
    }

    const transporter = getTransporter();

    await transporter.sendMail({
        from: `"ACE Mail" <${ENV.SMTP_FROM || ENV.SMTP_USER}>`,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
    });

    // Persist to DB
    await SentMail.create({
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
        sentBy: sender.id,
        sentByName: sender.name,
    });
};

export const getSentMails = async () => {
    return SentMail.find()
        .populate('sentBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(200);
};
