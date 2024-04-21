import z from 'zod'

export const createContractProposalSchema = z.object({
  title: z
    .string()
    .min(2, 'Please enter at least 2 characters for your proposal!')
    .max(200, 'Please enter at most 200 characters!'),
  description: z
    .string()
    .min(10, 'Please enter at least 10 characters!')
    .max(3000, 'Please enter at most 3000 characters!'),
  settledPrice: z.number().min(0.1, 'Please enter price!'),
})

export type CreateContractProposalSchema = z.infer<typeof createContractProposalSchema>
