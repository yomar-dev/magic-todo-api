import express from 'express';
import authRoutes from './features/auth/routes/auth.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok 🚀' } });
});

app.use('/auth', authRoutes);

export default app;
