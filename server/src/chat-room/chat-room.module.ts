import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
import { ChatRoomController } from './chat-room.controller'
import { ChatRoomService } from './chat-room.service'
import { ChatRoomGateway } from './chat-room.gateway'

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, ChatRoomGateway, PrismaService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
