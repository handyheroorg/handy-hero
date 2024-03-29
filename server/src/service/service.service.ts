import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { UsersService } from 'src/users/users.service'
import { CreateServiceDto, UpdateServiceDto } from './service.dto'

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService, private readonly usersService: UsersService) {}

  async createService(dto: CreateServiceDto, user: SanitizedUser) {
    const profile = await this.usersService.findProfile(user.id)

    return this.prisma.service.create({
      data: {
        ...dto,
        profile: { connect: { id: profile.id } },
      },
    })
  }

  async findById(id: string) {
    const service = await this.prisma.service.findFirst({ where: { id } })
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

    return this.prisma.service.update({ where: { id: service.id }, data: dto })
  }
}
