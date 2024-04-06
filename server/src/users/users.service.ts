import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { sanitizeUser } from 'src/utils'
import { Prisma } from '@prisma/client'
import { CreateUserDto, UpdateLocationDto, UpdateProfileDto, UpdateUserDto } from './users.dto'
import { SanitizedUser } from './users.types'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const userCreated = await this.prisma.user.create({
      data: dto,
      select: { id: true, fullName: true, email: true, role: true, mobileNumber: true },
    })

    if (userCreated.role === 'SERVICE_PROVIDER') {
      await this.prisma.serviceProviderProfile.create({ data: { userId: userCreated.id } })
    }

    return userCreated
  }

  async findUserById(id: string) {
    return this.prisma.user.findFirst({ where: { id }, include: { location: true } })
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

  async findProfile(userId: string) {
    const profile = await this.prisma.serviceProviderProfile.findFirst({ where: { userId } })
    if (!profile) {
      throw new InternalServerErrorException(`"Service Provider profile is not created for user ${userId}`)
    }

    return profile
  }

  async updateProfile(dto: UpdateProfileDto, user: SanitizedUser) {
    const profile = await this.findProfile(user.id)

    return this.prisma.serviceProviderProfile.update({
      where: { id: profile.id },
      data: {
        ...dto,
        education: dto.education as unknown as Prisma.InputJsonValue[],
        experience: dto.experience as unknown as Prisma.InputJsonValue[],
      },
    })
  }

  async findProfileById(id: string) {
    const profile = await this.prisma.serviceProviderProfile.findFirst({ where: { id } })
    if (!profile) {
      throw new NotFoundException('Profile not found!')
    }

    return profile
  }

  async findUserForProfile(profileId: string) {
    const profile = await this.findProfileById(profileId)

    const user = await this.prisma.user.findFirst({ where: { id: profile.userId } })

    return sanitizeUser(user)
  }

  async onboardUser(user: SanitizedUser) {
    const updatedUser = await this.prisma.user.update({ where: { id: user.id }, data: { isOnboarded: true } })
    return sanitizeUser(updatedUser)
  }
}
