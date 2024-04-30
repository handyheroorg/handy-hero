import { Prisma } from '@prisma/client'
import { USER_SELECT_FIELDS } from 'src/users/user.fields'

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
    select: USER_SELECT_FIELDS,
  },
  serviceProvider: {
    select: USER_SELECT_FIELDS,
  },
} satisfies Prisma.ContractInclude
