import express from 'express';
import { errorHandler } from './shared/middleware/errorHandler.js';
import authRoutes from './features/auth/routes/auth.routes.js';
import todoRoutes from './features/todos/routes/todo.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok 🚀' } });
});

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.use(errorHandler);

export default app;
