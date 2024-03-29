import { Prisma } from '@prisma/client'

export const FEEDBACK_INCLUDE_FIELDS = {
  client: { select: { id: true, fullName: true, avatar: true } },
  service: { select: { id: true, name: true, skills: true } },
} satisfies Prisma.FeedbackInclude
