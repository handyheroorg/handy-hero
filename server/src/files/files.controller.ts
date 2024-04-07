import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { FilesService } from './files.service'

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @User() user: SanitizedUser) {
    return this.filesService.uploadFile(file, user)
  }
}
