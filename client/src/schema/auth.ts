import { z } from 'zod'
import { omit } from 'remeda'
import { Role } from '@/types'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email!'),
  password: z.string().min(1, 'Please enter your password!'),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Please enter at least 2 characters!').max(50, 'Please enter at most 50 characters!'),
  email: z.string().email('Please enter a valid email address!'),
  password: z
    .string()
    .min(8, 'Password must consist 8 characters')
    .max(50, 'Password cannot be longer than 50 characters!'),
  role: z.nativeEnum(omit(Role, ['ADMIN'])),
  mobileNumber: z.string().min(10, 'Please enter correct mobile number').max(13, 'Please enter correct mobile number'),
  country: z.string().min(2, 'Please enter correct country name'),
})
export type SignupSchema = z.infer<typeof signupSchema>
