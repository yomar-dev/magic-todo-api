import { Router } from 'express';
import { authenticate } from '../../../shared/middleware/auth.js';
import { todoController } from '../controllers/todo.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', (req, res, next) => todoController.create(req, res, next));
router.get('/', (req, res, next) => todoController.list(req, res, next));
router.get('/:id', (req, res, next) => todoController.getById(req, res, next));
router.delete('/:id', (req, res, next) =>
  todoController.delete(req, res, next),
);

export default router;
