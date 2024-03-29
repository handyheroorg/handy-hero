import { IsMongoId } from 'class-validator'

export class CreateChatRequestDto {
  @IsMongoId()
  serviceId: string
}
