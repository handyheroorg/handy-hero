import { Reflector } from '@nestjs/core'
import { Role as RoleEnum } from '@prisma/client'

export const Role = Reflector.createDecorator<RoleEnum>()
