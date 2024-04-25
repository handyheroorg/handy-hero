import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChatRoomModule } from 'src/chat-room/chat-room.module'
import { ContractModule } from 'src/contract/contract.module'
import { UsersModule } from 'src/users/users.module'
import { ContractProposalController } from './contract-proposal.controller'
import { ContractProposalService } from './contract-proposal.service'

@Module({
  imports: [ChatRoomModule, ContractModule, UsersModule],
  controllers: [ContractProposalController],
  providers: [ContractProposalService, PrismaService],
})
export class ContractProposalModule {}
