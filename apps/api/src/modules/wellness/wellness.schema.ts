import { z } from 'zod';

export const createWellnessToolSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  duration_minutes: z.number().optional(), // in minutes
  content: z.string().optional(),
  image_url: z.string().optional(),
  is_premium: z.boolean().default(false),
  difficulty: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  icon: z.string().optional(),
});

export const updateWellnessToolSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  duration_minutes: z.number().optional(),
  content: z.string().optional(),
  image_url: z.string().optional(),
  is_premium: z.boolean().optional(),
  difficulty: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  icon: z.string().optional(),
});

export const wellnessToolResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  duration_minutes: z.number().nullable(),
  content: z.string().nullable(),
  image_url: z.string().nullable(),
  is_premium: z.boolean().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateWellnessToolInput = z.infer<typeof createWellnessToolSchema>;
export type UpdateWellnessToolInput = z.infer<typeof updateWellnessToolSchema>;
