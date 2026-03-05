import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import 'dotenv/config';

import { connectDB } from './config/database.js';
import { initializeAlgolia } from './config/algolia.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import storeRoutes from './routes/storeRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

let appInstance = null;
let initPromise = null;

const getAllowedOrigins = () => (
  [
    'http://localhost:3000',
    'https://rohanrice.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean)
);

const createRateLimiters = () => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: 'Too many login attempts, please try again later.',
  });

  return { limiter, authLimiter };
};

export const createApp = () => {
  if (appInstance) return appInstance;

  const app = express();
  const { limiter, authLimiter } = createRateLimiters();

  app.use(helmet());
  app.use(cors({
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(limiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.use(compression());
  app.use(requestLogger);

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/otp', otpRoutes);
  app.use('/api/store', storeRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Not Found',
      path: req.originalUrl,
    });
  });

  app.use(errorHandler);

  appInstance = app;
  return appInstance;
};

export const initializeBackendServices = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await initializeAlgolia();
    })();
  }

  return initPromise;
};

export default createApp;
