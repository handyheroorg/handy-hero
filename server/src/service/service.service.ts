import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { UsersService } from 'src/users/users.service'
import { Prisma } from '@prisma/client'
import { CreateServiceDto, FindServicesFiltersDto, UpdateServiceDto } from './service.dto'
import { SERVICE_INCLUDE_FIELDS } from './service.fields'

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService, private readonly usersService: UsersService) {}

  async createService(dto: CreateServiceDto, user: SanitizedUser) {
    const profile = await this.usersService.findProfile(user.id)

    if (profile.completionPercentage < 60) {
      throw new BadRequestException('Your profile must be at least 60% completed!')
    }

    const totalServicesCreated = await this.prisma.service.count({ where: { profileId: profile.id } })

    /**
     * If this is user's first service, then onboard the user
     */
    if (totalServicesCreated === 0) {
      await this.usersService.onboardUser(user)
    }

    return this.prisma.service.create({
      data: {
        ...dto,
        profile: { connect: { id: profile.id } },
        thumbnail: { connect: { id: dto.thumbnail } },
      },
      include: SERVICE_INCLUDE_FIELDS,
    })
  }

  async findById(id: string) {
    const service = await this.prisma.service.findFirst({ where: { id }, include: SERVICE_INCLUDE_FIELDS })
    if (!service) {
      throw new NotFoundException('Service not found!')
    }

    return service
  }

  async updateService(id: string, dto: UpdateServiceDto, user: SanitizedUser) {
    const profile = await this.usersService.findProfile(user.id)
    const service = await this.findById(id)

    if (service.profileId !== profile.id) {
      throw new ForbiddenException('You are not allowed to update this service!')
    }

    return this.prisma.service.update({
      where: { id: service.id },
      data: { ...dto, thumbnail: { connect: { id: dto.thumbnail } } },
      include: SERVICE_INCLUDE_FIELDS,
    })
  }

  findAll(filters: FindServicesFiltersDto) {
    const where: Prisma.ServiceWhereInput = {}

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ]
    }

    if (filters.maxPrice && filters.maxPrice) {
      where.AND = [{ price: { gte: filters.minPrice } }, { price: { lte: filters.maxPrice } }]
    }

    if (filters.priceType) {
      where.priceType = filters.priceType
    }

    if (filters.skills.length) {
      where.skills = { hasSome: filters.skills }
    }

    return this.prisma.service.findMany({ where, include: SERVICE_INCLUDE_FIELDS })
  }

  async findUserServices(user: SanitizedUser) {
    const profile = await this.usersService.findProfile(user.id)

    return this.prisma.service.findMany({ where: { profileId: profile.id }, include: SERVICE_INCLUDE_FIELDS })
  }

  async deleteService(id: string, user: SanitizedUser) {
    const service = await this.findById(id)
    const profile = await this.usersService.findProfile(user.id)

    if (service.profileId !== profile.id) {
      throw new ForbiddenException('You are not allowed to delete this resource!')
    }

    return this.prisma.service.delete({ where: { id: service.id }, include: SERVICE_INCLUDE_FIELDS })
  }
}
