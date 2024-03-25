import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SanitizedUser } from 'src/users/users.types'
import { Role } from './role.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roleAllowed = this.reflector.get(Role, context.getHandler())
    if (!roleAllowed) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user as SanitizedUser

    return user.role === roleAllowed
  }
}
