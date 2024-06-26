import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ServiceModule } from 'src/service/service.module'
import { UsersModule } from 'src/users/users.module'
import { ChatRoomModule } from 'src/chat-room/chat-room.module'
import { ChatRequestController } from './chat-request.controller'
import { ChatRequestService } from './chat-request.service'

@Module({
  imports: [ServiceModule, UsersModule, ChatRoomModule],
  controllers: [ChatRequestController],
  providers: [ChatRequestService, PrismaService],
})
export class ChatRequestModule {}
