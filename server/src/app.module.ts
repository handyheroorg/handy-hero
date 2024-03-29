import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import configOptions from './config/config.options'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './auth/auth.module'
import { ServiceModule } from './service/service.module'

@Module({
  imports: [ConfigModule.forRoot(configOptions), UsersModule, AuthModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
