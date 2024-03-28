import { User } from '@prisma/client'
import { omit } from 'remeda'
import { SanitizedUser } from 'src/users/users.types'

export function sanitizeUser(user: User): SanitizedUser {
  return omit(user, ['password'])
}
