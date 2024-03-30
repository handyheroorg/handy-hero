import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { CreateChatRoomDto } from './chat-room.dto'

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
        client: { select: { id: true, fullName: true } },
        provider: { select: { id: true, fullName: true } },
      },
    })
  }
}
