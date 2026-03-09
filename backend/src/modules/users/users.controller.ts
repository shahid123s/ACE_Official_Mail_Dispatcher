import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/authenticate';
import {
    getAllUsers,
    createUser,
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

export const createUserController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, role } = req.body;
        const result = await createUser(name, email, role);
        res.status(201).json({
            success: true,
            message: `User created. Share the temp password with them — it will not be shown again.`,
            user: result.user,
            tempPassword: result.tempPassword,
        });
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
