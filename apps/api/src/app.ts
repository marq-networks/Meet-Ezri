import Fastify, { FastifyRequest } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authPlugin from './plugins/auth';
import { userRoutes } from './modules/users/user.routes';
import { emailRoutes } from './modules/email/email.routes';
import { systemSettingsRoutes } from './modules/system-settings/system-settings.routes';
import { sessionRoutes } from './modules/sessions/sessions.routes';
import { moodRoutes } from './modules/moods/moods.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import jwkToPem from 'jwk-to-pem';
const jwtLib = require('jsonwebtoken');

dotenv.config();

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Register core plugins
app.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

// Check if secret is Base64 (common for Supabase) and decode it if necessary
const rawSecret = process.env.SUPABASE_JWT_SECRET || 'supersecret';
let secret: string | Buffer = rawSecret;
if (rawSecret.length > 20 && !rawSecret.includes(' ') && rawSecret.endsWith('=')) {
  try {
    secret = Buffer.from(rawSecret, 'base64');
    console.log('Detected Base64 JWT Secret, decoded to buffer.');
  } catch (e) {
    console.log('Failed to decode JWT Secret as Base64, using as string.');
  }
}

// Dynamic secret provider for handling both symmetric (HS256) and asymmetric (ES256/RS256) keys
let cachedJwks: any = null;
let lastJwksFetch = 0;

const getJwks = async (projectUrl: string) => {
  const now = Date.now();
  if (cachedJwks && now - lastJwksFetch < 1000 * 60 * 60) { // 1 hour cache
    return cachedJwks;
  }
  
  try {
    const response = await fetch(`${projectUrl}/auth/v1/.well-known/jwks.json`);
    if (!response.ok) throw new Error('Failed to fetch JWKS');
    const data = await response.json();
    cachedJwks = data;
    lastJwksFetch = now;
    console.log('Fetched JWKS keys:', data.keys?.length);
    return data;
  } catch (err) {
    console.error('Error fetching JWKS:', err);
    return null;
  }
};

const secretProvider = async (reqOrHeader: any, tokenOrPayload: any) => {
  let header;
  
  // Handle Fastify-JWT style (request, token)
  if (reqOrHeader.headers || reqOrHeader.raw) {
      // Manually decode header because fastify-jwt passes only payload by default
      const authHeader = reqOrHeader.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
          const tokenStr = authHeader.substring(7);
          const decoded = jwtLib.decode(tokenStr, { complete: true });
          header = decoded?.header;
      }
      
      if (!header) {
          header = tokenOrPayload?.header;
      }
  } 
  // Handle Fast-JWT style (header, payload)
  else {
      header = reqOrHeader;
  }

  if (!header) {
    // If we can't determine alg, fallback to secret (likely HS256)
    return secret;
  }
  
  if (header.alg === 'HS256') {
    return secret;
  }

  if (header.alg === 'ES256' || header.alg === 'RS256') {
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) throw new Error('SUPABASE_URL not set');
    
    const jwks = await getJwks(supabaseUrl);
    if (!jwks || !jwks.keys) throw new Error('No JWKS available');
    
    const key = jwks.keys.find((k: any) => k.kid === header.kid);
    if (!key) throw new Error('Matching key not found in JWKS');
    
    return jwkToPem(key);
  }

  return secret;
};

app.register(jwt, {
    secret: secretProvider,
    verify: {
      allowedAlgorithms: ['HS256', 'RS256', 'ES256', 'PS256'],
      cache: true
    }
  } as any);

// Register custom plugins
app.register(authPlugin);

// Register routes
app.get('/health', async () => {
  return { status: 'ok', service: 'api' };
});

app.register(userRoutes, { prefix: '/api/users' });
app.register(emailRoutes, { prefix: '/api/email' });
app.register(systemSettingsRoutes, { prefix: '/api/settings' });
app.register(sessionRoutes, { prefix: '/api/sessions' });
app.register(moodRoutes, { prefix: '/api/moods' });
app.register(adminRoutes, { prefix: '/api/admin' });

const start = async () => {
  try {
    await app.listen({ port: parseInt(process.env.PORT || '3001'), host: '0.0.0.0' });
    console.log(`Server listening on ${process.env.PORT || 3001}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
