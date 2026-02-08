import { FastifyInstance } from 'fastify';
import {
  completeOnboardingHandler,
  getMeHandler,
  updateProfileHandler,
  deleteUserHandler,
  getCreditsHandler,
  initProfileHandler,
  getAllUsersHandler,
  getUserProfileAdminHandler,
} from './user.controller';

export async function userRoutes(fastify: FastifyInstance) {
  // Admin Routes
  fastify.get(
    '/admin/users',
    {
      preHandler: [fastify.authenticate, fastify.authorize(['super_admin', 'org_admin'])],
    },
    getAllUsersHandler
  );

  fastify.get(
    '/admin/users/:userId',
    {
      preHandler: [fastify.authenticate, fastify.authorize(['super_admin', 'org_admin'])],
    },
    getUserProfileAdminHandler
  );

  // User Routes
  fastify.post(
    '/init',
    {
      preHandler: [fastify.authenticate],
    },
    initProfileHandler
  );

  fastify.get(
    '/me',
    {
      preHandler: [fastify.authenticate],
    },
    getMeHandler
  );

  fastify.get(
    '/credits',
    {
      preHandler: [fastify.authenticate],
    },
    getCreditsHandler
  );

  fastify.patch(
    '/me',
    {
      preHandler: [fastify.authenticate],
    },
    updateProfileHandler
  );

  fastify.post(
    '/onboarding',
    {
      preHandler: [fastify.authenticate],
    },
    completeOnboardingHandler
  );

  fastify.delete(
    '/me',
    {
      preHandler: [fastify.authenticate],
    },
    deleteUserHandler
  );
}
