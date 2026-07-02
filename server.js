require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const { verifyAccessToken } = require('./server/utils/jwt');

const app = require('./server/app');
const { connectDB } = require('./server/config/db');
const { initSnapshotCron } = require('./server/services/snapshotService');
const { startPriceBroadcast } = require('./server/services/priceService');

const PORT = process.env.PORT || 3002;

const start = async () => {
  await connectDB();

  // Create HTTP server so Socket.io can share the same port
  const httpServer = http.createServer(app);

  // Attach Socket.io with JWT authentication handshake
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3002',
      credentials: true
    }
  });

  // ── Socket.io Auth Middleware ──────────────────────────────────────────────
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // ── Socket.io Connection Handler ──────────────────────────────────────────
  io.on('connection', (socket) => {
    const room = `user_${socket.userId}`;
    socket.join(room);
    console.log(`[Socket.io] User ${socket.userId} connected → joined room ${room}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.io] User ${socket.userId} disconnected`);
    });
  });

  // ── Start background services ─────────────────────────────────────────────
  initSnapshotCron();
  startPriceBroadcast(io);

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`WebSocket: Socket.io ready on the same port`);
  });
};

start();
