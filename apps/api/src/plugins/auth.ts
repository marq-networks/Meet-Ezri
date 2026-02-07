import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../lib/prisma';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Force allowedAlgorithms to ensure fast-jwt accepts ES256/RS256
      // even if global config isn't propagated correctly to local verifier
      await request.jwtVerify({
        allowedAlgorithms: ['HS256', 'RS256', 'ES256', 'PS256']
      } as any);

      // Fetch user role from database and attach to request.user
      const user = request.user as any;
      if (user && user.sub) {
        const profile = await prisma.profiles.findUnique({
          where: { id: user.sub },
          select: { role: true, permissions: true }
        });
        
        if (profile) {
          user.appRole = profile.role; // Use appRole to avoid conflict with Supabase role
          user.permissions = profile.permissions;
        }
      }
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('authorize', (allowedRoles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as any;
      
      // If no user or no appRole, deny
      if (!user || !user.appRole) {
        reply.code(403).send({ 
          statusCode: 403,
          error: 'Forbidden',
          message: 'Access denied: No role assigned' 
        });
        return;
      }

      // Check if user has one of the allowed roles
      if (!allowedRoles.includes(user.appRole)) {
        reply.code(403).send({ 
          statusCode: 403,
          error: 'Forbidden',
          message: `Access denied: Requires one of [${allowedRoles.join(', ')}] role` 
        });
        return;
      }
    };
  });
});

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
    authorize: (allowedRoles: string[]) => any;
  }
}
