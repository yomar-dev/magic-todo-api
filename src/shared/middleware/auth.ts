import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { prisma } from '../../lib/prisma.js';
import { config } from '../../config/index.js';
import { UnauthorizedError } from '../exceptions/AppError.js';

export interface AuthUser {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token?.trim()) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    if (typeof decoded === 'string' || typeof decoded.userId !== 'string') {
      throw new UnauthorizedError('Invalid token payload');
    }

    const payload = { userId: decoded.userId } as AuthUser;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = { userId: user.id, email: user.email };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
}
