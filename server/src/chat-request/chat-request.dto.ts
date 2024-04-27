import { ChatRequestStatus } from '@prisma/client'
import { IsEnum, IsMongoId } from 'class-validator'
import { omit } from 'remeda'

export class CreateChatRequestDto {
  @IsMongoId()
  serviceId: string
}

export class ProcessChatRequestDto {
  @IsEnum(omit(ChatRequestStatus, ['PENDING']))
  status: 'ACCEPTED' | 'REJECTED'
}
