import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BadgeController } from './badge.controller'
import { BadgeService } from './badge.service'

@Module({
  controllers: [BadgeController],
  providers: [BadgeService, PrismaService],
})
export class BadgeModule {}
