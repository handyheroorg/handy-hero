import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { CreateContractDto } from './contract.dto'
import { CONTRACT_INCLUDE_FIELDS } from './contract.fields'

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
        title: dto.title,
        description: dto.description,
      },
    })
  }

  findAll(user: SanitizedUser) {
    return this.prisma.contract.findMany({
      where: {
        status: 'ON_GOING',
        OR: [{ serviceProviderId: user.id }, { clientId: user.id }],
      },
      include: CONTRACT_INCLUDE_FIELDS,
    })
  }

  async findOneById(id: string, user: SanitizedUser) {
    const contract = await this.prisma.contract.findFirst({ where: { id }, include: CONTRACT_INCLUDE_FIELDS })
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
