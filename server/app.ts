import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import formsRoutes from './routes/forms.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

export function createExpressApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  // Health check — handy for confirming the server boots before Next.js
  // takes over rendering.
  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/forms', formsRoutes);

  // 404 + error handler ONLY for /api/* — anything else falls through to
  // Next.js's request handler, which is wired up in server/index.ts.
  app.use('/api', notFoundHandler);
  app.use('/api', errorHandler);

  return app;
}
