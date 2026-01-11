import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  registrationCode: z.string().min(1, 'Registration code is required'),
});

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
