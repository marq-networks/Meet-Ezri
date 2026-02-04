import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

import { supabaseAdmin } from './config/supabase';

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  // Verify JWT
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return next(new Error('Authentication error'));
  
  socket.data.user = user;
  next();
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.data.user?.id);

  socket.on('tracking:start', (data) => {
    // Handle tracking start
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Realtime server running on port ${PORT}`);
});
