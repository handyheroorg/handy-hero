import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    exports: [ChatGateway, ChatService],
    providers: [ChatGateway, ChatService, PrismaService],
})
export class ChatModule {}