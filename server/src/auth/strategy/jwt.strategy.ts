import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Environment } from 'src/config/config.options'
import { UsersService } from 'src/users/users.service'
import { SanitizedUser } from 'src/users/users.types'
import { User } from '@prisma/client'
import { omit } from 'remeda'
import { JwtPayload } from '../auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<Environment>, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findUserById(payload.sub)
    if (!user) {
      throw new UnauthorizedException('Unauthorized User!')
    }

    return this.sanitizeUser(user)
  }

  private sanitizeUser(user: User): SanitizedUser {
    return omit(user, ['password'])
  }
}
