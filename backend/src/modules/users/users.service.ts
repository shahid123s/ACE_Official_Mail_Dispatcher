import User from '../../models/User';
import { createError } from '../../utils/createError';

export const getAllUsers = async () => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return users;
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    if (!['admin', 'user'].includes(role)) {
        throw createError('Invalid role', 400);
    }
    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    ).select('-password');
    if (!user) throw createError('User not found', 404);
    return user;
};

export const toggleUserActive = async (userId: string, active: boolean) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { active },
        { new: true }
    ).select('-password');
    if (!user) throw createError('User not found', 404);
    return user;
};
