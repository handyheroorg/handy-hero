import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ChatRoomService } from 'src/chat-room/chat-room.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { NotificationService } from 'src/notification/notification.service'
import { ContractService } from 'src/contract/contract.service'
import { NewContractProposalDto, ProcessContractProposalDto } from './contract-proposal.dto'
import { CONTRACT_PROPOSAL_INCLUDE } from './contract-proposal.fields'

@Injectable()
export class ContractProposalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRoomService: ChatRoomService,
    private readonly notificationService: NotificationService,
    private readonly contractService: ContractService,
  ) {}

  async findOneByChatRoom(chatRoomId: string) {
    return this.prisma.contractProposal.findFirst({ where: { chatRoomId } })
  }

  async findOneById(id: string) {
    const proposal = await this.prisma.contractProposal.findFirst({ where: { id } })
    if (!proposal) {
      throw new NotFoundException('Contract proposal not found!')
    }

    return proposal
  }

  async createProposal(chatRoomId: string, dto: NewContractProposalDto, user: SanitizedUser) {
    const chatRoom = await this.chatRoomService.findOneById(chatRoomId, user, true)

    const proposal = await this.findOneByChatRoom(chatRoomId)
    if (proposal) {
      throw new BadRequestException('Proposal for this chat room already exists!')
    }

    if (chatRoom.status !== 'IN_PROGESS') {
      throw new BadRequestException('This chat room is closed!')
    }

    const newProposal = await this.prisma.contractProposal.create({
      data: { chatRoom: { connect: { id: chatRoom.id } }, ...dto },
    })

    await Promise.all([
      this.chatRoomService.updateStatus(chatRoom.id, 'PROPOSAL_CREATED'),
      this.notificationService.sendEmailAndInApp({
        receiverId: chatRoom.providerId,
        receiverEmail: chatRoom.provider.email,
        receiverName: chatRoom.provider.fullName,
        subject: 'New proposal received',
        body: `You have received a new proposal for ${chatRoom.service.name}.`,
        buttonUrl: `/proposal/process/${newProposal.id}`,
      }),
    ])

    return newProposal
  }

  async findOneByChatRoomId(chatRoomId: string) {
    const proposal = await this.prisma.contractProposal.findFirst({ where: { chatRoomId } })
    if (!proposal) {
      throw new NotFoundException('Proposal not found for this chatroom!')
    }

    return proposal
  }

  async processProposal(chatRoomId: string, dto: ProcessContractProposalDto, user: SanitizedUser) {
    const proposal = await this.findOneByChatRoomId(chatRoomId)
    const chatRoom = await this.chatRoomService.findOneById(proposal.chatRoomId, user)

    if (chatRoom.status !== 'PROPOSAL_CREATED') {
      throw new BadRequestException('Chat room is already closed!')
    }

    if (proposal.status !== 'PENDING') {
      throw new BadRequestException('An action has been already taken on this proposal!')
    }

    /**
     * If service provider has rejected the proposal that mean the provider
     * is no more interested in the client and he/she wants to close the room
     */
    if (dto.status === 'REJECTED') {
      await Promise.all([
        this.chatRoomService.closeChatRoom(chatRoom.id, user),
        this.notificationService.sendNotification(chatRoom.clientId, {
          body: `Your proposal has been rejected for ${chatRoom.service.name}.`,
        }),
      ])
    }

    if (dto.status === 'ACCEPTED') {
      await Promise.all([
        this.contractService.createContract({
          clientId: chatRoom.clientId,
          serviceProviderId: chatRoom.providerId,
          serviceId: chatRoom.serviceId,
          settledPrice: proposal.settledPrice,
          title: proposal.title,
          description: proposal.description,
        }),
        this.chatRoomService.updateStatus(chatRoom.id, 'CONTRACT_AWARDED'),
        this.notificationService.sendNotification(chatRoom.clientId, {
          body: `Your proposal has been accepted for ${chatRoom.service.name}.`,
        }),
      ])
    }

    return this.prisma.contractProposal.update({ where: { id: proposal.id }, data: { status: dto.status } })
  }

  findAll(user: SanitizedUser) {
    return this.prisma.contractProposal.findMany({
      where: {
        OR: [{ chatRoom: { clientId: user.id } }, { chatRoom: { providerId: user.id } }],
      },
      include: CONTRACT_PROPOSAL_INCLUDE,
    })
  }
}
