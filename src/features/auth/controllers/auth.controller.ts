import { Request, Response, NextFunction } from 'express';

import { authService } from '../services/auth.service.js';
import { registerSchema } from '../validators/auth.validator.js';
import { success } from '../../../shared/utils/response.js';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = registerSchema.parse(req.body);
      const result = await authService.register(userData);
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
