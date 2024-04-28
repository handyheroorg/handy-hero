import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards } from '@nestjs/common'
import { SanitizedUser } from 'src/users/users.types'
import { JoinRoomDto, NewMessageDto } from './chat-room.dto'
import { ChatRoomAuthGuard } from './chat-room.guard'
import { ChatRoomService } from './chat-room.service'

type SocketWithUser = Socket & { user: SanitizedUser }

@UseGuards(ChatRoomAuthGuard)
@WebSocketGateway(8001, { cors: '*' })
export class ChatRoomGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  activeSockets: Map<string, Socket> = new Map()
  private logger = new Logger(ChatRoomGateway.name)

  @WebSocketServer()
  wss: Server

  constructor(private readonly chatRoomService: ChatRoomService) {}

  afterInit() {
    this.logger.log('ChatRoomGateway is initialized!')
  }

  handleConnection(socket: Socket) {
    if (!this.activeSockets.has(socket.id)) {
      this.activeSockets.set(socket.id, socket)
    }
  }

  handleDisconnect(socket: Socket) {
    if (this.activeSockets.has(socket.id)) {
      this.activeSockets.delete(socket.id)
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(socket: SocketWithUser, dto: JoinRoomDto) {
    this.wss.in(socket.id).socketsJoin(dto.roomId)
    this.wss.emit('room-joined', { userId: socket.user.id, socketId: socket.id })
  }

  @SubscribeMessage('message')
  async handleMessage(socket: SocketWithUser, dto: NewMessageDto) {
    const newMessage = await this.chatRoomService.addMessage(dto, socket.user)
    this.wss.to(dto.roomId).emit('message', newMessage)
  }
}
