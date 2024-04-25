import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SquareModule } from 'src/square/square.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'

@Module({
  imports: [SquareModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
