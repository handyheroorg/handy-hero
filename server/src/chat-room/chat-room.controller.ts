import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { ChatRoomService } from './chat-room.service'

@UseGuards(JwtAuthGuard)
@Controller('chat-rooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get()
  findAllForUser(@User() user: SanitizedUser) {
    return this.chatRoomService.findAllForUser(user)
  }

  @Get(':id')
  findOneById(@Param('id') id: string, @User() user: SanitizedUser) {
    return this.chatRoomService.findOneById(id, user)
  }
}
