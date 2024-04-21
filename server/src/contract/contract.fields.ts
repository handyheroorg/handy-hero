import { Prisma } from '@prisma/client'

export const CONTRACT_INCLUDE_FIELDS = {
  service: {
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      priceType: true,
    },
  },
  client: {
    select: { id: true, fullName: true, avatar: true },
  },
  serviceProvider: {
    select: { id: true, fullName: true, avatar: true },
  },
} satisfies Prisma.ContractInclude
