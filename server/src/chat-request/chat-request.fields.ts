import { Prisma } from '@prisma/client'

export const CHAT_REQUEST_INCLUDE_FIELDS = {
  service: {
    select: { id: true, name: true, description: true, price: true, priceType: true, skills: true, thumbnail: true },
  },
} satisfies Prisma.ChatRequestInclude
