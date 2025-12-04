import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import xss from "xss-clean";

import { pool } from "./config/database";
import { initializeSentry, sentryErrorHandler } from "./config/sentry";
import { setupSwagger } from "./config/swagger";
import logger from "./config/logger";
import {
  helmetConfig,
  generalLimiter,
  authLimiter,
  sanitizeData,
  preventParameterPollution,
  corsOptions,
} from "./middleware/security.middleware";
import { authRouter } from "./routes/auth.routes";
import { campaignsRouter } from "./routes/campaigns.routes";
import { investmentsRouter } from "./routes/investments.routes";
import { restaurantsRouter } from "./routes/restaurants.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const port = process.env.PORT || 4000;

// Version: 1.0.1

// Initialize Sentry for error tracking
initializeSentry(app);

// Security middleware
app.use(helmetConfig); // Set security headers
app.use(cors(corsOptions)); // CORS configuration
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(xss()); // XSS protection
app.use(sanitizeData); // Data sanitization
app.use(preventParameterPollution); // HPP protection

// Rate limiting
app.use(generalLimiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API Documentation
setupSwagger(app);

// Health check endpoints
app.get("/health", async (_req, res) => {
  try {
    const dbResult = await pool.query("SELECT NOW() as time");
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      dbTime: dbResult.rows[0].time,
    });
  } catch (err) {
    logger.error("Health check failed", err);
    res.status(500).json({
      status: "error",
      database: "unreachable",
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/health/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ ready: true });
  } catch (err) {
    res.status(503).json({ ready: false });
  }
});

app.get("/health/live", (_req, res) => {
  res.status(200).json({ alive: true });
});

// API routes with specific rate limiting
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/investments", investmentsRouter);
app.use("/api/restaurants", restaurantsRouter);

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    statusCode: 404,
  });
});

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler());

// Centralized error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`🚀 TastyFund backend started`);
  logger.info(`📍 Server: http://localhost:${port}`);
  logger.info(`📚 API Docs: http://localhost:${port}/api-docs`);
  logger.info(`💚 Health: http://localhost:${port}/health`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
