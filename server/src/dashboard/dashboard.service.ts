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
        return this.getClientDashboardStats()
      }

      case 'SERVICE_PROVIDER': {
        return this.getProviderDashboardStats(user)
      }

      default: {
        throw new NotImplementedException('This user role is not implemented!')
      }
    }
  }

  async getClientDashboardStats() {
    return {}
  }

  async getProviderDashboardStats(user: SanitizedUser) {
    const [pendingChatRequests, acceptedChatRequests, rejectedChatRequests, onGoingContracts] = await Promise.all([
      this.prisma.chatRequest.count({
        where: { status: 'PENDING', serviceProviderId: user.id },
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
      acceptedChatRequests,
      rejectedChatRequests,
      onGoingContracts,
    }
  }
}
