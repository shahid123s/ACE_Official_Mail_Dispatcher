import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../../models/User';
import { ENV } from '../../config/env';
import { createError } from '../../utils/createError';

const signToken = (id: string): string => {
    const options: SignOptions = { expiresIn: '7d' };
    return jwt.sign({ id }, ENV.JWT_SECRET, options);
};

// ─── Login ─────────────────────────────────────────────────────────────────────
export const loginService = async (email: string, password: string) => {
    if (!email || !password) {
        throw createError('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw createError('Invalid credentials', 401);
    if (!user.active) throw createError('Your account is deactivated. Contact an admin.', 403);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw createError('Invalid credentials', 401);

    const token = signToken(String(user._id));

    return {
        token,
        mustChangePassword: user.mustChangePassword,
        user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

// ─── Change Password ───────────────────────────────────────────────────────────
export const changePasswordService = async (
    userId: string,
    currentPassword: string,
    newPassword: string
) => {
    if (!currentPassword || !newPassword) {
        throw createError('Current and new password are required', 400);
    }

    if (newPassword.length < 8) {
        throw createError('New password must be at least 8 characters', 400);
    }

    if (currentPassword === newPassword) {
        throw createError('New password must be different from the current password', 400);
    }

    const user = await User.findById(userId).select('+password');
    if (!user) throw createError('User not found', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw createError('Current password is incorrect', 401);

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    return { message: 'Password changed successfully' };
};
