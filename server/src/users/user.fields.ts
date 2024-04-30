import { Prisma } from '@prisma/client'

export const USER_INCLUDE_FIELDS = { location: true, avatar: true } satisfies Prisma.UserInclude

export const USER_SELECT_FIELDS = {
  id: true,
  fullName: true,
  email: true,
  avatar: true,
  country: true,
  isOnboarded: true,
  isEmailVerified: true,
  isMobileNumberVerified: true,
  isPaymentVerified: true,
  location: true,
  role: true,
  squareCustomerId: true,
} satisfies Prisma.UserSelect
