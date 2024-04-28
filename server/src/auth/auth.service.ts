import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { NotificationService } from 'src/notification/notification.service'
import { SigninDto, SignupDto } from './auth.dto'
import { JwtPayload } from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.userService.findUserByEmail(dto.email)
    if (user) {
      throw new BadRequestException('User with this email already exists!')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const newUser = await this.userService.createUser({ ...dto, password: hashedPassword })

    /** Adding the user to our notification engine */
    const [firstName, ...lastName] = newUser.fullName.split(' ')
    await this.notificationService.addSubscriber(newUser.id, {
      email: newUser.email,
      firstName,
      lastName: lastName.join(' '),
      phone: newUser.mobileNumber,
    })

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

  async verifyToken(token: string) {
    return this.jwtService.verify(token) as JwtPayload
  }
}
