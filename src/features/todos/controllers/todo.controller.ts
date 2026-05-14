import { Request, Response, NextFunction } from 'express';

import { todoService } from '../services/todo.service.js';
import { createTodoSchema } from '../validators/todo.validator.js';
import { success } from '../../../shared/utils/response.js';

export class TodoController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const todoInput = createTodoSchema.parse(req.body);
      const todo = await todoService.create(req.user!.userId, todoInput);
      res.status(201).json(success(todo));
    } catch (error) {
      next(error);
    }
  }
}

export const todoController = new TodoController();
