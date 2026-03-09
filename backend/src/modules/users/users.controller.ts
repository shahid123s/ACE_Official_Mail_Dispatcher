import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/authenticate';
import {
    getAllUsers,
    updateUserRole,
    toggleUserActive,
} from './users.service';

export const listUsers = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};

export const patchUserRole = async (
    req: AuthRequest & { params: { id: string } },
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { role } = req.body;
        const user = await updateUserRole(id, role);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

export const patchUserActive = async (
    req: AuthRequest & { params: { id: string } },
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { active } = req.body;
        const user = await toggleUserActive(id, active);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};
