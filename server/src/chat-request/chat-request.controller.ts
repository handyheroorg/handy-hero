import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { CreateChatRequestDto, ProcessChatRequestDto } from './chat-request.dto'
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

  @Get()
  findAll(@User() user: SanitizedUser) {
    return this.chatRequestService.findAll(user)
  }

  @UseGuards(RoleGuard)
  @Role('CLIENT')
  @Delete(':id')
  deleteChatRequest(@Param('id') id: string, @User() user: SanitizedUser) {
    return this.chatRequestService.deleteChatRequest(id, user)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.chatRequestService.findById(id)
  }

  @UseGuards(RoleGuard)
  @Role('SERVICE_PROVIDER')
  @Post('process/:id')
  processChatRequest(@Param('id') id: string, @Body() dto: ProcessChatRequestDto, @User() user: SanitizedUser) {
    return this.chatRequestService.processChatRequest(id, dto, user)
  }
}
