import { z } from 'zod';

export const sendEmailSchema = z
  .object({
    to: z.string().email(),
    subject: z.string().min(1),
    html: z.string().default(""),
    text: z.string().default(""),
  })
  .refine(
    (data) =>
      data.html.trim().length > 0 || data.text.trim().length > 0,
    {
      message: "Either html or text must contain content",
      path: ["html"],
    }
  );

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
