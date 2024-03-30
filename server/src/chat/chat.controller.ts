import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    
}