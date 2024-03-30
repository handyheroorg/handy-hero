import { IsMongoId } from 'class-validator'

export class CreateChatRoomDto {
  @IsMongoId()
  clientId: string

  @IsMongoId()
  providerId: string

  @IsMongoId()
  serviceId: string
}
