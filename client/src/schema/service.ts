import { z } from 'zod'

export const createServiceSchema = z
  .object({
    name: z.string().min(3, 'Please enter at least 3 characters!').max(300, 'Please enter at most 300 characters!'),
    description: z
      .string()
      .min(10, 'Please enter at least 10 characters!')
      .max(3000, 'Please enter at most 3000 characters!')
      .optional(),
    thumbnail: z.string({ required_error: 'Please upload an image for thumbnail of your service!' }),
    skills: z.array(z.string()).min(1, 'Please add at least one skill!'),
    price: z.coerce.number({ invalid_type_error: 'Please enter price!' }).min(0.1, 'Please enter your service price!'),
    priceType: z.enum(['HOURLY', 'FIXED']),
    maxHours: z.number().positive().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.priceType === 'HOURLY' && !values.maxHours) {
      ctx.addIssue({
        message: 'Please enter max hours',
        code: 'custom',
        path: ['maxHours'],
      })
    }
  })
export type CreateServiceSchema = z.infer<typeof createServiceSchema>
