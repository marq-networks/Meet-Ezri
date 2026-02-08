import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  plan_type: z.enum(['free', 'basic', 'pro', 'enterprise']),
  billing_cycle: z.enum(['monthly', 'yearly']).default('monthly'),
  payment_method: z.string().optional(),
});

export const updateSubscriptionSchema = z.object({
  plan_type: z.enum(['free', 'basic', 'pro', 'enterprise']).optional(),
  billing_cycle: z.enum(['monthly', 'yearly']).optional(),
  status: z.enum(['active', 'cancelled', 'expired']).optional(),
});

export const subscriptionResponseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  plan_type: z.string(),
  status: z.string(),
  start_date: z.date(),
  end_date: z.date().nullable(),
  billing_cycle: z.string().nullable(),
  amount: z.number().nullable(),
  next_billing_at: z.date().nullable(),
  payment_method: z.string().nullable(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
