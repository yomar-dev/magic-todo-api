import { Request, Response, NextFunction } from 'express';

import { todoService } from '../services/todo.service.js';
import {
  createTodoSchema,
  listTodoSchema,
} from '../validators/todo.validator.js';
import { success, paginated } from '../../../shared/utils/response.js';

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

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const listTodoInput = listTodoSchema.parse(req.query);
      const result = await todoService.list(req.user!.userId, listTodoInput);
      res
        .status(200)
        .json(
          paginated(result.todos, result.total, result.limit, result.offset),
        );
    } catch (error) {
      next(error);
    }
  }
}

export const todoController = new TodoController();
