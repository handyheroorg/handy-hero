import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { UpdateUserDto } from './users.dto'
import { User } from './users.decorator'
import { SanitizedUser } from './users.types'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch()
  updateUser(@Body() dto: UpdateUserDto, @User() user: SanitizedUser) {
    return this.userService.updateUser(dto, user)
  }
}
