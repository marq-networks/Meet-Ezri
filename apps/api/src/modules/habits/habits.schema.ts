import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  frequency: z.enum(["daily", "weekly"]).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  is_archived: z.boolean().optional(),
});

export const logHabitSchema = z.object({
  completed_at: z.string().datetime().optional(), // ISO string, defaults to now if not provided
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type LogHabitInput = z.infer<typeof logHabitSchema>;
