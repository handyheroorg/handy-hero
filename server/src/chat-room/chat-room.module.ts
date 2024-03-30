import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChatRoomController } from './chat-room.controller'
import { ChatRoomService } from './chat-room.service'

@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService, PrismaService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
