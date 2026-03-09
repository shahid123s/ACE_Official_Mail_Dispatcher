import User from '../../models/User';
import { createError } from '../../utils/createError';
import { generateTempPassword } from '../../utils/generateTempPassword';

export const getAllUsers = async () => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return users;
};

export const createUser = async (
    name: string,
    email: string,
    role: 'admin' | 'user' = 'user'
) => {
    if (!name || !email) {
        throw createError('Name and email are required', 400);
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        throw createError('A user with this email already exists', 409);
    }

    const tempPassword = generateTempPassword();

    const user = await User.create({
        name,
        email,
        password: tempPassword,
        role,
        active: true,
        mustChangePassword: true,
    });

    // Return the temp password plaintext (only time it's visible)
    return {
        user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active,
            mustChangePassword: user.mustChangePassword,
        },
        tempPassword,
    };
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
