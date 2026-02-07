import { z } from 'zod';

export const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
