import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatDto, ChatRoomDto } from "./chat.dto";

@Injectable()
export class ChatService {
    private readonly connectedClients: Map<string, Socket> = new Map();
    constructor(private readonly prisma: PrismaService ) {}
    handleConnection(socket: Socket) {
        const clientId = socket.id;
        this.connectedClients.set(clientId, socket);
        console.log("successfully connected to the s    ocket server")
    
        socket.on('disconnect', () => {
          this.connectedClients.delete(clientId);
          console.log("disconnected")
        });
    }
    
    async handleMessage(data: ChatDto, client: Socket) {
        console.log('data')
        console.log(data)
        const { userId, servicePrividerId, status } = data;
        console.log(data)
        const message = await this.prisma.testModel.create({
            data: data
        });
        if(message) {
            return message            
        }
        return 'error'
    }

    async handleChatSend(data: ChatRoomDto, client: Socket) {
        console.log('chat', data)

        return await this.prisma.chatRoom.create({data: data})
    }
}