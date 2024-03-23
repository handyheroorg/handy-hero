import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { AuthService } from './auth.service'
import { SigninDto, SignupDto } from './auth.dto'
import { JwtAuthGuard } from './auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() dto: SigninDto) {
    return this.authService.signIn(dto)
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@User() user: SanitizedUser) {
    return user
  }
}
