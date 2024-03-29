import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { ServiceService } from './service.service'
import { CreateServiceDto } from './service.dto'

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Role('SERVICE_PROVIDER')
  createService(@Body() dto: CreateServiceDto, @User() user: SanitizedUser) {
    return this.serviceService.createService(dto, user)
  }
}
