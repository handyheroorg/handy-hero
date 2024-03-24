import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email!'),
  password: z.string().min(1, 'Please enter your password!'),
})

export type LoginSchema = z.infer<typeof loginSchema>
