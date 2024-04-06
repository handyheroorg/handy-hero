import { z } from 'zod'

export const updateUserSchema = z.object({
  fullName: z.string(),
  mobileNumber: z.string(),
  country: z.string(),
  avatar: z.string().optional(),
})
export type UpdateUserSchema = z.infer<typeof updateUserSchema>
