import crypto from 'crypto';

/**
 * Generates a readable temp password like: Ace#7x2K
 */
export const generateTempPassword = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const random = crypto.randomBytes(6);
    const base = Array.from(random)
        .map((b) => chars[b % chars.length])
        .join('');
    return `Ace#${base}`;
};
