import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { UsersService } from 'src/users/users.service'
import { sanitizeUser } from 'src/utils'

@Injectable()
export class ChatRoomAuthGuard implements CanActivate {
  constructor(private readonly userService: UsersService, private readonly authService: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const authHeader = ctx.getArgs()[0]?.handshake?.headers?.authorization as string
    if (!authHeader) return false

    const authToken = authHeader.split(' ')[1]
    if (!authToken) return false

    const jwtPayload = await this.authService.verifyToken(authToken)
    if (!jwtPayload) return false

    const user = await this.userService.findUserById(jwtPayload.sub)
    if (!user) return false

    ctx.switchToHttp().getRequest().user = sanitizeUser(user)
    ctx.switchToWs().getClient().user = sanitizeUser(user)

    return true
  }
}
