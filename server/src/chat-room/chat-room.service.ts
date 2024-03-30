import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
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
}
