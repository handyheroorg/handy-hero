import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { ServiceService } from 'src/service/service.service'
import { UsersService } from 'src/users/users.service'
import { NotificationService } from 'src/notification/notification.service'
import { ConfigService } from '@nestjs/config'
import { Environment } from 'src/config/config.options'
import { ChatRoomService } from 'src/chat-room/chat-room.service'
import { CreateChatRequestDto, ProcessChatRequestDto } from './chat-request.dto'
import { CHAT_REQUEST_INCLUDE_FIELDS } from './chat-request.fields'

@Injectable()
export class ChatRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceService: ServiceService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService<Environment>,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  async createChatRequest(dto: CreateChatRequestDto, user: SanitizedUser) {
    const service = await this.serviceService.findById(dto.serviceId, user)
    const serviceProvider = await this.userService.findUserForProfile(service.profileId)

    const chatRequest = await this.prisma.chatRequest.findFirst({
      where: {
        clientId: user.id,
        serviceProviderId: serviceProvider.id,
        serviceId: service.id,
      },
    })

    if (chatRequest) {
      throw new BadRequestException('Chat request for this service is already created!')
    }

    await this.notificationService.sendNotification(serviceProvider.id, {
      body: `${user.fullName} has sent you a chat request!`,
    })

    return this.prisma.chatRequest.create({
      data: {
        client: { connect: { id: user.id } },
        serviceProvider: { connect: { id: serviceProvider.id } },
        service: { connect: { id: service.id } },
      },
    })
  }

  async findAll(user: SanitizedUser) {
    return this.prisma.chatRequest.findMany({
      where: { OR: [{ clientId: user.id }, { serviceProviderId: user.id }] },
      include: CHAT_REQUEST_INCLUDE_FIELDS,
    })
  }

  async findById(id: string) {
    const chatRequest = await this.prisma.chatRequest.findFirst({ where: { id }, include: CHAT_REQUEST_INCLUDE_FIELDS })
    if (!chatRequest) {
      throw new NotFoundException('Chat request not found!')
    }

    return chatRequest
  }

  async deleteChatRequest(id: string, user: SanitizedUser) {
    const chatRequest = await this.findById(id)
    if (chatRequest.clientId !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this request!')
    }

    return this.prisma.chatRequest.delete({ where: { id } })
  }

  async processChatRequest(id: string, dto: ProcessChatRequestDto, user: SanitizedUser) {
    const chatRequest = await this.prisma.chatRequest.findFirst({
      where: { id },
      include: { client: true, service: true },
    })
    if (!chatRequest) {
      throw new NotFoundException('Chat request not found!')
    }
    if (chatRequest.serviceProviderId !== user.id) {
      throw new ForbiddenException('You are not allowed to process this chat request!')
    }

    if (dto.status === 'REJECTED') {
      await this.notificationService.sendNotification(chatRequest.clientId, {
        body: `Status of chat request for service ${chatRequest.service.name} has been updated.`,
      })
      return this.prisma.chatRequest.update({ where: { id }, data: { status: 'REJECTED' } })
    }

    if (dto.status !== 'ACCEPTED') {
      throw new BadRequestException('Invalid status provided!')
    }

    await Promise.all([
      /** If a chat request is ACCEPTED then a chat room will be created */
      this.chatRoomService.createChatRoom({
        serviceId: chatRequest.serviceId,
        clientId: chatRequest.clientId,
        providerId: chatRequest.serviceProviderId,
      }),
      this.notificationService.sendEmailAndInApp({
        receiverId: chatRequest.clientId,
        receiverEmail: chatRequest.client.email,
        receiverName: chatRequest.client.fullName,
        subject: 'Status of your chat request is updated',
        body: `Status of your chat request has been updated for service ${chatRequest.service.name}.`,
        buttonUrl: `${this.configService.get('FRONTEND_BASE_URL')}/chat-requests/${chatRequest.id}`,
      }),
    ])

    return this.prisma.chatRequest.update({ where: { id }, data: { status: 'ACCEPTED' } })
  }
}
