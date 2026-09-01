import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  next: z.string().optional(),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name.").max(120),
  classYear: z
    .union([
      z.literal(""),
      z.coerce
        .number()
        .int()
        .min(2000, "Class year must be 2000 or later.")
        .max(2100, "Class year must be 2100 or earlier."),
    ])
    .optional(),
  major: z.string().trim().max(120).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
