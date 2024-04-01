import { BadRequestException, Injectable } from '@nestjs/common'
import { ChatRoomService } from 'src/chat-room/chat-room.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { NewContractProposalDto } from './contract-proposal.dto'

@Injectable()
export class ContractProposalService {
  constructor(private readonly prisma: PrismaService, private readonly chatRoomService: ChatRoomService) {}

  async findOneByChatRoom(chatRoomId: string) {
    return this.prisma.contractProposal.findFirst({ where: { chatRoomId } })
  }

  async createProposal(chatRoomId: string, dto: NewContractProposalDto, user: SanitizedUser) {
    const chatRoom = await this.chatRoomService.findOneById(chatRoomId, user)

    const proposal = await this.findOneByChatRoom(chatRoomId)
    if (proposal) {
      throw new BadRequestException('Proposal for this chat room already exists!')
    }

    return this.prisma.contractProposal.create({
      data: { chatRoom: { connect: { id: chatRoom.id } }, settledPrice: dto.settledPrice },
    })
  }
}
