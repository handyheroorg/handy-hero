import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import configOptions from './config/config.options'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './auth/auth.module'
import { ServiceModule } from './service/service.module'
import { FeedbackModule } from './feedback/feedback.module'
import { BadgeModule } from './badge/badge.module'
import { ChatRequestModule } from './chat-request/chat-request.module'

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    UsersModule,
    AuthModule,
    ServiceModule,
    FeedbackModule,
    BadgeModule,
    ChatRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
