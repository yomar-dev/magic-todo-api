import { Request, Response, NextFunction } from 'express';

import { authService } from '../services/auth.service.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator.js';
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = loginSchema.parse(req.body);
      const result = await authService.login(userData);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = refreshTokenSchema.parse(req.body);
      const tokens = await authService.refresh(userData.refreshToken);
      res.status(200).json(success(tokens));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
