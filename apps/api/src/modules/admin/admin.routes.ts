import { FastifyInstance } from 'fastify';
import { getDashboardStatsHandler } from './admin.controller';
import { dashboardStatsSchema } from './admin.schema';
import { z } from 'zod';

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/stats',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: dashboardStatsSchema,
        },
      },
    },
    getDashboardStatsHandler
  );
}
