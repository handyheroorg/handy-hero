import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { ChatRoomDto } from "./chat.dto";

@Injectable()
export class ChatService {
    private readonly connectedClients: Map<string, Socket> = new Map();
    constructor(private readonly prisma: PrismaService ) {}
    handleConnection(socket: Socket) {
        const clientId = socket.id;
        this.connectedClients.set(clientId, socket);
        console.log("successfully connected to the socket server")
    
        socket.on('disconnect', () => {
          this.connectedClients.delete(clientId);
          console.log("disconnected")
        });
    }
    
    

    async handleChatSend(data: ChatRoomDto, client: Socket) {
        return await this.prisma.chatRoom.create({data: data})
    }
}