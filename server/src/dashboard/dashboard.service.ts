import { Injectable, NotImplementedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(user: SanitizedUser) {
    switch (user.role) {
      case 'ADMIN': {
        return null
      }

      case 'CLIENT': {
        return this.getClientDashboardStats(user)
      }

      case 'SERVICE_PROVIDER': {
        return this.getProviderDashboardStats(user)
      }

      default: {
        throw new NotImplementedException('This user role is not implemented!')
      }
    }
  }

  async getClientDashboardStats(user: SanitizedUser) {
    const [sentChatRequests, acceptedChatRequest, rejectedChatRequests, onGoingContracts] = await Promise.all([
      this.prisma.chatRequest.count({ where: { clientId: user.id, status: 'PENDING' } }),
      this.prisma.chatRequest.count({ where: { clientId: user.id, status: 'ACCEPTED' } }),
      this.prisma.chatRequest.count({ where: { clientId: user.id, status: 'REJECTED' } }),
      this.prisma.contract.count({ where: { clientId: user.id, status: 'ON_GOING' } }),
    ])

    return {
      sentChatRequests,
      acceptedChatRequest,
      rejectedChatRequests,
      onGoingContracts,
    }
  }

  async getProviderDashboardStats(user: SanitizedUser) {
    const [pendingChatRequests, pendingProposals, acceptedChatRequests, rejectedChatRequests, onGoingContracts] =
      await Promise.all([
        this.prisma.chatRequest.count({
          where: { status: 'PENDING', serviceProviderId: user.id },
        }),
        this.prisma.contractProposal.count({
          where: { status: 'PENDING', chatRoom: { providerId: user.id } },
        }),
        this.prisma.chatRequest.count({
          where: { status: 'ACCEPTED', serviceProviderId: user.id },
        }),
        this.prisma.chatRequest.count({
          where: { status: 'REJECTED', serviceProviderId: user.id },
        }),
        this.prisma.contract.count({
          where: { status: 'ON_GOING', serviceProviderId: user.id },
        }),
      ])

    return {
      pendingChatRequests,
      pendingProposals,
      acceptedChatRequests,
      rejectedChatRequests,
      onGoingContracts,
    }
  }
}
