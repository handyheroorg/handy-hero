import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Environment } from 'src/config/config.options'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'

@Injectable()
export class FilesService {
  s3Client: S3Client

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<Environment>,
  ) {
    this.s3Client = new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_ACCESS_SECRET'),
      },
    })
  }

  async uploadFile(file: Express.Multer.File, user: SanitizedUser) {
    try {
      const Key = `${user.id}/${file.originalname}`
      const Bucket = this.configService.get('AWS_BUCKET_NAME')

      const putCommand = new PutObjectCommand({
        Bucket,
        Key,
        ContentType: file.mimetype,
        Body: file.buffer,
      })

      await this.s3Client.send(putCommand)
      const publicUrl = this.generatePublicUrl(Key, Bucket)

      return this.prisma.file.create({
        data: {
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          publicUrl,
          uploadedBy: { connect: { id: user.id } },
        },
      })
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong while uploading file!')
    }
  }

  private generatePublicUrl(key: string, bucket: string) {
    return `https://${bucket}.s3-ap-south-1.amazonaws.com/${key}`
  }
}
