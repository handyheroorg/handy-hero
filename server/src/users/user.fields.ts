import { Prisma } from '@prisma/client'

export const USER_INCLUDE_FIELDS = { location: true, avatar: true } satisfies Prisma.UserInclude
