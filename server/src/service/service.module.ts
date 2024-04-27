import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { ServiceController } from './service.controller'
import { ServiceService } from './service.service'

@Module({
  imports: [UsersModule],
  controllers: [ServiceController],
  providers: [ServiceService, PrismaService],
  exports: [ServiceService],
})
export class ServiceModule {}
