import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SigninDto, SignupDto } from './auth.dto'

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
}
