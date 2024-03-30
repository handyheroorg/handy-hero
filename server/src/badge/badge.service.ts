import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BadgeFiltersDto, CreateBadgeDto } from './badge.dto'

@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  createBadge(dto: CreateBadgeDto) {
    return this.prisma.badge.create({ data: dto })
  }

  findAll(filters: BadgeFiltersDto) {
    return this.prisma.badge.findMany({ where: { type: filters.type } })
  }
}
