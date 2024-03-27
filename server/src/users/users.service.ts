import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './users.dto'

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
}
