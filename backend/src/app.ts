import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      'http://localhost:3000',
  })
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'TRC Booking API is running',
  });
});

app.use('/api/auth', authRoutes);

export default app;