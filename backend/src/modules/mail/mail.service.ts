import nodemailer from 'nodemailer';
import { ENV } from '../../config/env';
import { createError } from '../../utils/createError';

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    html: string;
    cc?: string | string[];
    bcc?: string | string[];
}

const getTransporter = () => {
    return nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: ENV.SMTP_PORT,
        secure: ENV.SMTP_PORT === 465,
        auth: {
            user: ENV.SMTP_USER,
            pass: ENV.SMTP_PASS,
        },
    });
};

export const sendMail = async (options: SendMailOptions): Promise<void> => {
    if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) {
        throw createError('SMTP configuration is missing', 500);
    }

    const transporter = getTransporter();

    await transporter.sendMail({
        from: ENV.SMTP_FROM || ENV.SMTP_USER,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html: options.html,
    });
};
