import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SquareController } from './square.controller'
import { SquareService } from './square.service'

@Module({
  providers: [SquareService, PrismaService],
  controllers: [SquareController],
  exports: [SquareService],
})
export class SquareModule {}
