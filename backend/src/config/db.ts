import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    }
};
