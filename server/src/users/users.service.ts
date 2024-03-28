import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { sanitizeUser } from 'src/utils'
import { CreateUserDto, UpdateLocationDto, UpdateUserDto } from './users.dto'
import { SanitizedUser } from './users.types'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const userCreated = await this.prisma.user.create({
      data: dto,
      select: { id: true, fullName: true, email: true, role: true },
    })

    if (userCreated.role === 'SERVICE_PROVIDER') {
      await this.prisma.serviceProviderProfile.create({ data: { userId: userCreated.id } })
    }

    return userCreated
  }

  async findUserById(id: string) {
    return this.prisma.user.findFirst({ where: { id } })
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

  async updateUser(dto: UpdateUserDto, user: SanitizedUser) {
    const updatedUser = await this.prisma.user.update({ where: { id: user.id }, data: dto })
    return sanitizeUser(updatedUser)
  }

  async updateLocation(dto: UpdateLocationDto, user: SanitizedUser) {
    const location = await this.prisma.location.findFirst({ where: { userId: user.id } })
    if (location) {
      return this.prisma.location.update({ where: { id: location.id }, data: dto })
    }

    return this.prisma.location.create({ data: { ...dto, user: { connect: { id: user.id } } } })
  }
}
