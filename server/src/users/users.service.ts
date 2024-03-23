import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const userExists = await this.prisma.user.findFirst({ where: { email: dto.email } })
    if (userExists) {
      throw new BadRequestException('User with this email already exists!')
    }

    return this.prisma.user.create({ data: dto, select: { id: true, fullName: true, email: true, role: true } })
  }

  async findUserById(id: string) {
    return this.prisma.user.findFirst({ where: { id } })
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }
}
