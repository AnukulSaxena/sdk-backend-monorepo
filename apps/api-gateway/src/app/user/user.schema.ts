import { z } from 'zod';

export const createUserSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
