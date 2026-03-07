import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import mailRoutes from './modules/mail/mail.route';

const app: Application = express();

// ─── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Server is healthy 🚀' });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/mail', mailRoutes);

// ─── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

export default app;
