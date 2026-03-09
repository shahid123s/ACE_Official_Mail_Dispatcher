import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';
import { createError } from '../utils/createError';

export const requireAdmin = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    if (req.user?.role !== 'admin') {
        return next(createError('Admin access required', 403));
    }
    next();
};
