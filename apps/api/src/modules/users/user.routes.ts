import { FastifyInstance } from 'fastify';
import {
  completeOnboardingHandler,
  getMeHandler,
  updateProfileHandler,
  deleteUserHandler,
  getCreditsHandler,
  initProfileHandler,
} from './user.controller';

export async function userRoutes(fastify: FastifyInstance) {
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
