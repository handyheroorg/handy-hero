import { z } from 'zod'

export const createCardSchema = z.object({
  token: z.string(),
  brand: z.string(),
  expMonth: z.number(),
  expYear: z.number(),
  last4: z.string(),
})
export type CreateCardSchema = z.infer<typeof createCardSchema>
