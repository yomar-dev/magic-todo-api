import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions/AppError.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      data: null,
      errors: [{ message: err.message, details: err.errors }],
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    data: null,
    errors: [{ message: 'Internal server error' }],
  });
}
