import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { ServiceService } from './service.service'
import { CreateServiceDto, FindServicesFiltersDto, UpdateServiceDto } from './service.dto'

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

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Role('SERVICE_PROVIDER')
  updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto, @User() user: SanitizedUser) {
    return this.serviceService.updateService(id, dto, user)
  }

  @Get('my-services')
  findUserServices(@User() user: SanitizedUser) {
    return this.serviceService.findUserServices(user)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.serviceService.findById(id)
  }

  @Get()
  findAll(@Query() filters: FindServicesFiltersDto) {
    return this.serviceService.findAll(filters)
  }
}
