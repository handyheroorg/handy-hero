import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { sanitizeUser } from 'src/utils'
import { Prisma, ServiceProviderProfile } from '@prisma/client'
import { merge } from 'remeda'
import { SquareService } from 'src/square/square.service'
import { CreateUserDto, UpdateLocationDto, UpdateProfileDto, UpdateUserDto } from './users.dto'
import { SanitizedUser } from './users.types'
import { USER_INCLUDE_FIELDS } from './user.fields'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly squareService: SquareService) {}

  async createUser(dto: CreateUserDto) {
    const [firstName, ...lastName] = dto.fullName.split(' ')

    const squareCustomer = await this.squareService.addCustomer({
      givenName: firstName,
      familyName: lastName.join(' '),
      emailAddress: dto.email,
    })

    const userCreated = await this.prisma.user.create({
      data: { ...dto, squareCustomerId: squareCustomer.id },
      select: { id: true, fullName: true, email: true, role: true, mobileNumber: true },
    })

    if (userCreated.role === 'SERVICE_PROVIDER') {
      await this.prisma.serviceProviderProfile.create({ data: { userId: userCreated.id } })
    }

    return userCreated
  }

  async findUserById(id: string) {
    return this.prisma.user.findFirst({ where: { id }, include: USER_INCLUDE_FIELDS })
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

  async updateUser(dto: UpdateUserDto, user: SanitizedUser) {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...dto,
        avatar: dto.avatar ? { connect: { id: dto.avatar } } : undefined,
      },
      include: USER_INCLUDE_FIELDS,
    })
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
        completionPercentage: this.calculateCompletionPercentage(profile, dto),
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

  async onboardUser(id: string) {
    const updatedUser = await this.prisma.user.update({ where: { id }, data: { isOnboarded: true } })
    return sanitizeUser(updatedUser)
  }

  private calculateCompletionPercentage(profile: ServiceProviderProfile, dto: UpdateProfileDto) {
    const mergedData = merge(profile, dto)
    const allFields = [
      mergedData.occupation,
      mergedData.about,
      mergedData.fullAddress,
      mergedData.experienceLevel,
      mergedData.languages.length,
      mergedData.skills.length,
      mergedData.education.length,
      mergedData.experience.length,
    ]

    const completedFields = allFields.filter(Boolean).length

    return (completedFields / allFields.length) * 100
  }
}
