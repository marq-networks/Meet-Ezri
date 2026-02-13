import { FastifyInstance } from 'fastify';
import { getDashboardStatsHandler, getUsersHandler, getUserHandler, updateUserHandler, deleteUserHandler, getUserAuditLogsHandler, getRecentActivityHandler } from './admin.controller';
import { dashboardStatsSchema, userListSchema, userSchema, updateUserSchema } from './admin.schema';
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

  fastify.get(
    '/stats/recent',
    {
      preHandler: [fastify.authenticate],
    },
    getRecentActivityHandler
  );

  fastify.get(
    '/users',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: userListSchema,
        },
      },
    },
    getUsersHandler
  );

  fastify.get(
    '/users/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: userSchema,
        },
      },
    },
    getUserHandler
  );

  fastify.patch(
    '/users/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: updateUserSchema,
        response: {
          200: userSchema,
        },
      },
    },
    updateUserHandler
  );

  fastify.delete(
    '/users/:id',
    {
      preHandler: [fastify.authenticate],
    },
    deleteUserHandler
  );

  fastify.get(
    '/users/:id/audit-logs',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: z.array(z.object({
            id: z.string(),
            action: z.string(),
            created_at: z.date(),
            details: z.any().optional(),
          })),
        },
      },
    },
    getUserAuditLogsHandler
  );
}
