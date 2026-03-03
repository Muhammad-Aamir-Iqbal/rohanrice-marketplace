import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http';

// Import config
import { connectDB } from './config/database.js';
import { initializeAlgolia } from './config/algolia.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import otpRoutes from './routes/otpRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// ====== MIDDLEWARE ======

// Security
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://rohanrice.com',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 auth attempts per 15 min
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Compression
app.use(compression());

// Request logging
app.use(requestLogger);

// ====== ROUTES ======

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/otp', otpRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    path: req.originalUrl
  });
});

// ====== ERROR HANDLING ======
app.use(errorHandler);

// ====== SOCKET.IO SETUP ======
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://rohanrice.com',
      process.env.FRONTEND_URL
    ],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);

  // Join user to personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room`);
  });

  // Real-time stock updates
  socket.on('subscribe-stock', (productId) => {
    socket.join(`stock-${productId}`);
  });

  // Messaging
  socket.on('send-message', (data) => {
    io.to(`user-${data.userId}`).emit('new-message', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Export io for use in routes/controllers
export { io };

// ====== START SERVER ======
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Initialize Algolia
    await initializeAlgolia();
    console.log('✅ Algolia initialized');

    // Start server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🌾 RohanRice Marketplace Server         ║
║   Node: ${process.version.substring(1, 5)}                             ║
║   Port: ${PORT}                              ║
║   Env: ${process.env.NODE_ENV}              ║
║   Ready for connections ✨               ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  // In production, send alert to monitoring service
});

export default server;
