import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
  exports: [FilesService],
})
export class FilesModule {}
