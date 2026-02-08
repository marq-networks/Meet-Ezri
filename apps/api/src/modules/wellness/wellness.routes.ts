import { FastifyInstance } from 'fastify';
import { createWellnessToolSchema, updateWellnessToolSchema, wellnessToolResponseSchema } from './wellness.schema';
import { createWellnessToolHandler, deleteWellnessToolHandler, getWellnessToolByIdHandler, getWellnessToolsHandler, updateWellnessToolHandler } from './wellness.controller';
import { z } from 'zod';

export async function wellnessRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        querystring: z.object({
          category: z.string().optional(),
        }),
        response: {
          200: z.array(wellnessToolResponseSchema),
        },
      },
      preHandler: [app.authenticate],
    },
    getWellnessToolsHandler
  );

  app.get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: wellnessToolResponseSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    getWellnessToolByIdHandler
  );

  // Admin only
  app.post(
    '/',
    {
      schema: {
        body: createWellnessToolSchema,
        response: {
          201: wellnessToolResponseSchema,
        },
      },
      preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    },
    createWellnessToolHandler
  );

  app.patch(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: updateWellnessToolSchema,
        response: {
          200: wellnessToolResponseSchema,
        },
      },
      preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    },
    updateWellnessToolHandler
  );

  app.delete(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
      preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    },
    deleteWellnessToolHandler
  );
}
