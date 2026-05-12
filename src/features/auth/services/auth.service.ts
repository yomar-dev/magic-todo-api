import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../../../config/index.js';
import { prisma } from '../../../lib/prisma.js';
import { RegisterInput } from '../validators/auth.validator.js';
import type { AuthResponse, UserResponse } from '../types/auth.types.js';
import { ConflictError } from '../../../shared/exceptions/AppError.js';

export class AuthService {
  async register(userData: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  private generateTokens(user: UserResponse) {
    const accessToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions,
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
