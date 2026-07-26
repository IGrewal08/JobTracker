import http from 'http';
import { app } from './app.js';
import { Redis } from 'ioredis';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createAdapter } from '@socket.io/redis-adapter';
import { initQueue } from './queues/scrape.queue.js';

const httpServer = http.createServer(app);

const pubClient = new Redis({ host: process.env.HOST, port: 6379 });
const subClient = pubClient.duplicate();

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.HOST_URL,
    credentials: true,
  },
  adapter: createAdapter(pubClient, subClient),
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token as string;
    if (!token) return next(new Error('No token provided.'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    socket.data.userId = decoded.id;
    next();
  } catch {
    next(new Error('Invalid token.'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.userId as string;
  socket.join(userId);
  console.log(`[socket.io] User ${userId} connected (${socket.id})`);

  socket.on('disconnect', () => {
    console.log(`[socket.io] User ${userId} disconnected`);
  });
});

const PORT = Number(process.env.PORT) || 3000;
httpServer.listen(PORT, 'localhost', async () => {
  await initQueue();
  console.log(`Server running on port ${PORT}`);
});
