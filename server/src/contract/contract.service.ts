import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { CreateContractDto } from './contract.dto'

@Injectable()
export class ContractService {
  constructor(private readonly prisma: PrismaService) {}

  async createContract(dto: CreateContractDto) {
    const contract = await this.prisma.contract.findFirst({
      where: {
        clientId: dto.clientId,
        serviceProviderId: dto.serviceProviderId,
        serviceId: dto.serviceId,
      },
    })

    if (contract) {
      throw new BadRequestException('A contract has been already created for this service.')
    }

    return this.prisma.contract.create({
      data: {
        serviceProvider: { connect: { id: dto.serviceProviderId } },
        client: { connect: { id: dto.clientId } },
        service: { connect: { id: dto.serviceId } },
        settledPrice: dto.settledPrice,
      },
    })
  }

  findAll(user: SanitizedUser) {
    return this.prisma.contract.findMany({
      where: {
        OR: [{ serviceProviderId: user.id }, { clientId: user.id }],
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            priceType: true,
            skills: true,
            thumbnail: true,
          },
        },
        client: {
          select: { id: true, fullName: true, avatar: true },
        },
        serviceProvider: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
    })
  }

  async findOneById(id: string, user: SanitizedUser) {
    const contract = await this.prisma.contract.findFirst({ where: { id } })
    if (!contract) {
      throw new BadRequestException('Contract not found!')
    }

    if (contract.clientId !== user.id && contract.serviceProviderId !== user.id) {
      throw new ForbiddenException('You are not allowed to view this contract!')
    }

    return contract
  }

  async endContract(id: string, user: SanitizedUser) {
    const contract = await this.findOneById(id, user)

    if (contract.status === 'COMPLETED') {
      throw new BadRequestException('This contract has been already ended!')
    }

    return this.prisma.contract.update({ where: { id: contract.id }, data: { status: 'COMPLETED' } })
  }
}
