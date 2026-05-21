import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import authRoutes from './features/auth/routes/auth.routes.js';
import todoRoutes from './features/todos/routes/todo.routes.js';

const app = express();

app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok 🚀' } });
});

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.use(errorHandler);

export default app;
