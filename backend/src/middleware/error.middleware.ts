import { NextFunction, Request, Response } from "express";

// Basic typed error interface for application errors
export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;

  if (process.env.NODE_ENV !== "production") {
    // In dev, log full error
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message: err.message || "Internal server error"
  });
}
