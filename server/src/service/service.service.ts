import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { CreateServiceDto } from './service.dto'

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async createService(dto: CreateServiceDto, user: SanitizedUser) {
    const profile = await this.prisma.serviceProviderProfile.findFirst({ where: { userId: user.id } })
    if (!profile) {
      throw new InternalServerErrorException(`Service provider profile is not created for user - ${user.id}`)
    }

    return this.prisma.service.create({
      data: {
        ...dto,
        profile: { connect: { id: profile.id } },
      },
    })
  }
}
