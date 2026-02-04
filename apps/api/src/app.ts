import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify({ logger: true });

app.register(cors);
app.register(jwt, {
  secret: process.env.SUPABASE_JWT_SECRET || 'supersecret'
});

app.get('/health', async () => {
  return { status: 'ok', service: 'api' };
});

const start = async () => {
  try {
    await app.listen({ port: parseInt(process.env.PORT || '3001'), host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
