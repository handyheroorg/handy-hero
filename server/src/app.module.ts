import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import configOptions from './config/config.options'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './auth/auth.module'
import { ChatGateway } from './chat/chat.gateway'
import { ChatModule } from './chat/chat.module'

@Module({
  imports: [ConfigModule.forRoot(configOptions), UsersModule, AuthModule, ChatModule],
  controllers: [AppController],
    providers: [AppService, PrismaService, ChatGateway],
})
export class AppModule {}
