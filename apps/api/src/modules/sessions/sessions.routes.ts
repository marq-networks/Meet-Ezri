import { FastifyInstance } from 'fastify';
import { createSessionHandler, getSessionsHandler, getSessionHandler, endSessionHandler, createMessageHandler, getSessionTranscriptHandler, scheduleSessionHandler } from './sessions.controller';
import { createSessionSchema, endSessionSchema, createMessageSchema } from './sessions.schema';

export async function sessionRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: {
        body: createSessionSchema,
      },
      preHandler: [app.authenticate],
    },
    createSessionHandler
  );

  app.post(
    '/schedule',
    {
      schema: {
        body: createSessionSchema,
      },
      preHandler: [app.authenticate],
    },
    scheduleSessionHandler
  );

  app.get(
    '/',
    {
      preHandler: [app.authenticate],
    },
    getSessionsHandler
  );

  app.get(
    '/:id',
    {
        preHandler: [app.authenticate],
    },
    getSessionHandler
  );

  app.post(
    '/:id/end',
    {
      schema: {
        body: endSessionSchema,
      },
      preHandler: [app.authenticate],
    },
    endSessionHandler
  );

  app.post(
    '/:id/messages',
    {
      schema: {
        body: createMessageSchema,
      },
      preHandler: [app.authenticate],
    },
    createMessageHandler
  );

  app.get(
    '/:id/transcript',
    {
      preHandler: [app.authenticate],
    },
    getSessionTranscriptHandler
  );
}
