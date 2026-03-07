import { AppError } from '../middlewares/errorHandler';

export const createError = (message: string, statusCode: number): AppError => {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    return error;
};
