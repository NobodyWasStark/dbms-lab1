import { z } from 'zod';

// Phone Regex supporting Bangladesh (+8801... / 01...) and International E.164 formats
export const PHONE_REGEX = /^(?:(?:\+|00)8801|01)[3-9]\d{8}$|^\+?[1-9]\d{9,14}$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, { message: 'Full name must be at least 3 characters long' })
      .max(100, { message: 'Full name cannot exceed 100 characters' }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    phone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, {
        message: 'Enter a valid phone number (e.g., 01712345678 or +8801712345678)',
      }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
      message: 'Please select your gender',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
