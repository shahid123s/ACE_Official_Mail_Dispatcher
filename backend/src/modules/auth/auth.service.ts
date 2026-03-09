import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../../models/User';
import { ENV } from '../../config/env';
import { createError } from '../../utils/createError';

const signToken = (id: string): string => {
    const options: SignOptions = { expiresIn: '7d' };
    return jwt.sign({ id }, ENV.JWT_SECRET, options);
};

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
        user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
