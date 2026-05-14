import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../../../config/index.js';
import { prisma } from '../../../lib/prisma.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';
import type { AuthResponse, UserResponse } from '../types/auth.types.js';
import {
  ConflictError,
  UnauthorizedError,
} from '../../../shared/exceptions/AppError.js';

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

  async login(userData: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    const { accessToken, refreshToken } = this.generateTokens(userResponse);

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret);

      if (
        typeof decoded === 'string' ||
        !decoded.userId ||
        typeof decoded.userId !== 'string'
      ) {
        throw new UnauthorizedError('Invalid token payload');
      }

      const { userId } = decoded as { userId: string };

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      const { accessToken, refreshToken } = this.generateTokens(user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
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
