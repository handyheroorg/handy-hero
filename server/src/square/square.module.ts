import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ContractModule } from 'src/contract/contract.module'
import { SquareController } from './square.controller'
import { SquareService } from './square.service'

@Module({
  imports: [ContractModule],
  providers: [SquareService, PrismaService],
  controllers: [SquareController],
  exports: [SquareService],
})
export class SquareModule {}
