import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.route';
import mailRoutes from './modules/mail/mail.route';
import usersRoutes from './modules/users/users.route';

const app: Application = express();

// ─── Connect Database ──────────────────────────────────────────────────────────
connectDB();

// ─── Global Middlewares ────────────────────────────────────────────────────────
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            process.env.CORS_ORIGIN || 'http://localhost:5173',
            'http://localhost:5173',
            'http://localhost:3000',
        ];
        // Allow requests with no origin (Postman, curl, mobile apps)
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Server is healthy 🚀' });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mail', mailRoutes);
app.use('/api/v1/users', usersRoutes);

// ─── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

export default app;
