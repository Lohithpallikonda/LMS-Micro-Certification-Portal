import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();

export function createApp() {
  const app = express();
  app.use(cors({ origin: '*', credentials: false }));
  app.use(express.json());
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/results', resultRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

// Vercel handler expects default export
const app = createApp();
export default app;

// Local dev startup
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  (async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      console.log('MongoDB connected');
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
    } catch (err) {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    }
  })();
}
