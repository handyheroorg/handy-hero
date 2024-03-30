import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { SigninDto, SignupDto } from './auth.dto'
import { JwtPayload } from './auth.types'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) {}

  async signup(dto: SignupDto) {
    const user = await this.userService.findUserByEmail(dto.email)
    if (user) {
      throw new BadRequestException('User with this email already exists!')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const newUser = await this.userService.createUser({ ...dto, password: hashedPassword })

    return this.generateToken(newUser)
  }

  async signIn(dto: SigninDto) {
    const user = await this.userService.findUserByEmail(dto.email)
    if (!user) {
      throw new NotFoundException('Invalid Credentails!')
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password)
    if (!passwordMatch) {
      throw new BadRequestException('Invalid Credentials!')
    }

    return this.generateToken(user)
  }

  private async generateToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email } satisfies JwtPayload

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
