import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { CreateChatRequestDto } from './chat-request.dto'
import { ChatRequestService } from './chat-request.service'

@UseGuards(JwtAuthGuard)
@Controller('chat-request')
export class ChatRequestController {
  constructor(private readonly chatRequestService: ChatRequestService) {}

  @UseGuards(RoleGuard)
  @Role('CLIENT')
  @Post()
  createChatRequest(@Body() dto: CreateChatRequestDto, @User() user: SanitizedUser) {
    return this.chatRequestService.createChatRequest(dto, user)
  }
}
