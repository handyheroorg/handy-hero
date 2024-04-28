import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { ChatRoomStatus } from '@prisma/client'
import { CreateChatRoomDto, NewMessageDto } from './chat-room.dto'

@Injectable()
export class ChatRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createChatRoom(dto: CreateChatRoomDto) {
    const room = await this.prisma.chatRoom.findFirst({ where: dto })
    if (room) {
      throw new BadRequestException('ChatRoom for this service already exists!')
    }

    return this.prisma.chatRoom.create({
      data: {
        client: { connect: { id: dto.clientId } },
        provider: { connect: { id: dto.providerId } },
        service: { connect: { id: dto.serviceId } },
      },
    })
  }

  findAllForUser(user: SanitizedUser) {
    return this.prisma.chatRoom.findMany({
      where: {
        clientId: user.role === 'CLIENT' ? user.id : undefined,
        providerId: user.role === 'SERVICE_PROVIDER' ? user.id : undefined,
      },
      include: {
        service: { select: { id: true, name: true } },
        client: { select: { id: true, fullName: true, avatar: true } },
        provider: { select: { id: true, fullName: true, avatar: true } },
      },
    })
  }

  async findOneById(id: string, user: SanitizedUser, includeEmail?: boolean) {
    const room = await this.prisma.chatRoom.findFirst({ where: { id } })
    if (user.id !== room.providerId && user.id !== room.clientId) {
      throw new ForbiddenException('You are not allowed to access this chat room!')
    }

    return this.prisma.chatRoom.findFirst({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        service: { select: { id: true, name: true, description: true, price: true, priceType: true, skills: true } },
        client: { select: { id: true, fullName: true, email: includeEmail } },
        provider: { select: { id: true, fullName: true, email: includeEmail } },
      },
    })
  }

  async closeChatRoom(id: string, user: SanitizedUser) {
    const chatRoom = await this.findOneById(id, user)
    return this.prisma.chatRoom.update({ where: { id: chatRoom.id }, data: { status: 'CLOSED' } })
  }

  async addMessage(dto: NewMessageDto, user: SanitizedUser) {
    const chatRoom = await this.findOneById(dto.roomId, user)

    return this.prisma.message.create({
      data: {
        content: dto.content,
        seen: dto.seen,
        chatRoom: { connect: { id: chatRoom.id } },
        sentBy: { connect: { id: user.id } },
      },
    })
  }

  async findMessageById(id: string) {
    const message = await this.prisma.message.findFirst({ where: { id } })
    if (!message) {
      throw new NotFoundException('Message not found!')
    }

    return message
  }

  async deleteMessage(id: string, user: SanitizedUser) {
    const message = await this.findMessageById(id)
    if (message.sentById !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this message!')
    }

    return this.prisma.message.delete({ where: { id: message.id } })
  }

  async updateStatus(id: string, status: ChatRoomStatus) {
    return this.prisma.chatRoom.update({ where: { id }, data: { status } })
  }
}
