import { Request, Response, NextFunction } from 'express';
import { loginService, changePasswordService } from './auth.service';
import { AuthRequest } from '../../middlewares/authenticate';

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await loginService(email, password);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

export const getMe = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await changePasswordService(req.user!.id, currentPassword, newPassword);
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};
