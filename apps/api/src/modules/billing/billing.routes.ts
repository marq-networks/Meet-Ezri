import { FastifyInstance } from 'fastify';
import { createSubscriptionSchema, subscriptionResponseSchema, updateSubscriptionSchema, createCreditPurchaseSchema } from './billing.schema';
import { cancelSubscriptionHandler, createSubscriptionHandler, getBillingHistoryHandler, getSubscriptionHandler, updateSubscriptionHandler, getAllSubscriptionsHandler, adminUpdateSubscriptionHandler, getSubscriptionByUserIdHandler, createPortalSessionHandler, createCreditPurchaseHandler } from './billing.controller';
import { stripeWebhookHandler } from './billing.webhook';
import { z } from 'zod';

export async function billingRoutes(app: FastifyInstance) {
  app.post(
    '/webhook',
    {
      config: { rawBody: true },
    },
    stripeWebhookHandler
  );

  app.get(
    '/',
    {
      schema: {
        response: {
          200: subscriptionResponseSchema.extend({
              id: z.string().optional(),
              user_id: z.string().optional(),
              created_at: z.date().optional(),
              updated_at: z.date().optional()
          }),
        },
      },
      preHandler: [app.authenticate],
    },
    getSubscriptionHandler
  );

  app.post(
    '/',
    {
      schema: {
        body: createSubscriptionSchema,
        response: {
          200: z.union([
            z.object({ checkoutUrl: z.string() }),
            z.object({ subscription: subscriptionResponseSchema })
          ]),
        },
      },
      preHandler: [app.authenticate],
    },
    createSubscriptionHandler
  );

  app.post(
    '/credits',
    {
      schema: {
        body: createCreditPurchaseSchema,
        response: {
          200: z.object({ checkoutUrl: z.string() }),
        },
      },
      preHandler: [app.authenticate],
    },
    createCreditPurchaseHandler
  );

  app.post(
    '/portal',
    {
      schema: {
        response: {
          200: z.object({ portalUrl: z.string() }),
        },
      },
      preHandler: [app.authenticate],
    },
    createPortalSessionHandler
  );

  app.patch(
    '/',
    {
      schema: {
        body: updateSubscriptionSchema,
        response: {
          200: subscriptionResponseSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    updateSubscriptionHandler
  );

  app.post(
    '/cancel',
    {
      schema: {
        response: {
          200: z.object({ message: z.string() }),
        },
      },
      preHandler: [app.authenticate],
    },
    cancelSubscriptionHandler
  );

  app.get(
    '/history',
    {
      schema: {
        response: {
          200: z.array(subscriptionResponseSchema),
        },
      },
      preHandler: [app.authenticate],
    },
    getBillingHistoryHandler
  );

  app.get(
    '/admin/subscriptions',
    {
      schema: {
        response: {
          200: z.array(subscriptionResponseSchema.extend({
            id: z.string().optional(),
            user_id: z.string().optional(),
            created_at: z.date().optional(),
            updated_at: z.date().optional(),
            users: z.object({
              email: z.string().optional(),
              profiles: z.object({
                full_name: z.string().nullable().optional(),
              }).nullable().optional()
            }).optional()
          })),
        },
      },
      preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    },
    getAllSubscriptionsHandler
  );

  app.get(
    '/admin/users/:userId/subscription',
    {
      schema: {
        params: z.object({ userId: z.string() }),
        response: {
          200: subscriptionResponseSchema.extend({
              id: z.string().optional(),
              user_id: z.string().optional(),
              created_at: z.date().optional(),
              updated_at: z.date().optional()
          }),
        },
      },
      preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin'])],
    },
    getSubscriptionByUserIdHandler
  );
}
