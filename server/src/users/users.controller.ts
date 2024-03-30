import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { UsersService } from './users.service'
import { UpdateLocationDto, UpdateProfileDto, UpdateUserDto } from './users.dto'
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

  @Patch('location')
  updateLocation(@Body() dto: UpdateLocationDto, @User() user: SanitizedUser) {
    return this.userService.updateLocation(dto, user)
  }

  @UseGuards(RoleGuard)
  @Role('SERVICE_PROVIDER')
  @Patch('profile')
  updateProfile(@Body() dto: UpdateProfileDto, @User() user: SanitizedUser) {
    return this.userService.updateProfile(dto, user)
  }
}
