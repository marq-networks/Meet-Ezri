import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  plan_type: z.enum(['trial', 'core', 'pro']),
  billing_cycle: z.enum(['monthly', 'yearly']).default('monthly'),
  payment_method: z.string().optional(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
});

export const createCreditPurchaseSchema = z.object({
  credits: z.number().min(1),
});

export const updateSubscriptionSchema = z.object({
  plan_type: z.enum(['trial', 'core', 'pro']).optional(),
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
  amount: z.union([z.number(), z.string(), z.any()]).nullable(),
  next_billing_at: z.date().nullable(),
  payment_method: z.string().nullable(),
});

export const invoiceResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  amount_due: z.number(),
  currency: z.string(),
  created: z.string().datetime(),
  hosted_invoice_url: z.string().nullable(),
  invoice_pdf: z.string().nullable(),
  description: z.string().nullable(),
});

export const adminInvoiceResponseSchema = invoiceResponseSchema.extend({
  user_id: z.string().nullable().optional(),
  user_email: z.string().nullable().optional(),
  user_name: z.string().nullable().optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type CreateCreditPurchaseInput = z.infer<typeof createCreditPurchaseSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
