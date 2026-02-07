import { FastifyInstance } from 'fastify';
import { sendEmailHandler } from './email.controller';

export async function emailRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/send',
    {
      // Using manual validation in controller to avoid fastify-type-provider-zod "reading 'run'" error
      preHandler: [fastify.authenticate],
    },
    sendEmailHandler
  );
}
