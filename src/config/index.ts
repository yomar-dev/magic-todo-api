import dotenv from 'dotenv';

dotenv.config();

export const config = {
  database: {
    url: (() => {
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error('DATABASE_URL environment variable is required');
      }
      return url;
    })(),
  },
  jwt: {
    secret: (() => {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
      }
      return secret;
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: (() => {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is required');
      }
      return refreshSecret;
    })(),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
};
