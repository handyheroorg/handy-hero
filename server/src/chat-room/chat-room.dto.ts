import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator'

export class CreateChatRoomDto {
  @IsMongoId()
  clientId: string

  @IsMongoId()
  providerId: string

  @IsMongoId()
  serviceId: string
}

export class NewMessageDto {
  @IsString()
  content: string

  @IsOptional()
  @IsBoolean()
  seen?: boolean

  @IsMongoId()
  roomId: string
}

export class JoinRoomDto {
  @IsMongoId()
  roomId: string
}
