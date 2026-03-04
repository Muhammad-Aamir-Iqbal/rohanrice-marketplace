import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

import { createApp, initializeBackendServices } from './app.js';
import { setIO } from './realtime/io.js';

const PORT = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:3000',
  'https://rohanrice.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

setIO(io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('subscribe-stock', (productId) => {
    socket.join(`stock-${productId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`user-${data.userId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const startServer = async () => {
  try {
    await initializeBackendServices();

    server.listen(PORT, () => {
      console.log(`RohanRice server listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

export { io };
export default server;
