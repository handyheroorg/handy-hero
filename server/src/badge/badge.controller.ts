import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { BadgeService } from './badge.service'
import { BadgeFiltersDto, CreateBadgeDto } from './badge.dto'

@UseGuards(JwtAuthGuard)
@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Role('ADMIN')
  createBadge(@Body() dto: CreateBadgeDto) {
    return this.badgeService.createBadge(dto)
  }

  @Get()
  findAll(@Query() filters: BadgeFiltersDto) {
    return this.badgeService.findAll(filters)
  }
}
