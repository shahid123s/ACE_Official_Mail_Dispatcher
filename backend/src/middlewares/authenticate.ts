import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { createError } from '../utils/createError';
import User from '../models/User';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'user';
    };
}

export const authenticate = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next(createError('No token provided', 401));
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };

        const user = await User.findById(decoded.id).select('-password');
        if (!user) return next(createError('User not found', 401));
        if (!user.active) return next(createError('Account is deactivated', 403));

        req.user = {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
        };
        next();
    } catch {
        next(createError('Invalid or expired token', 401));
    }
};
