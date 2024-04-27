import { Prisma } from '@prisma/client'

export const SERVICE_INCLUDE_FIELDS = {
  thumbnail: true,
} satisfies Prisma.ServiceInclude
