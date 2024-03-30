import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io';
import { ChatService } from "./chat.service";
import { ChatDto, ChatRoomDto } from "./chat.dto";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) {}

    handleConnection(client: any) {
        return this.chatService.handleConnection(client);
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: ChatDto, @ConnectedSocket() client: Socket) {
        console.log('hello w')
        this.sendMessage(data)
           return this.chatService.handleMessage(data, client)
        }
        
    sendMessage(message: any) {
        console.log('sendmessage chlgya')
        this.server.emit('newMessage', message);
        return message
    }

    @SubscribeMessage('chat-receive')
    handleChatReceive(@MessageBody() data: ChatRoomDto, @ConnectedSocket() client: Socket) {
        console.log("chat re");
        return this.chatService.handleChatSend(data, client);
    }
}