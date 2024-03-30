import { ChatStatus } from '@prisma/client'
import { IsBoolean, IsEmail, IsEnum, IsString, MinLength, ValidateNested } from 'class-validator'


export class ChatRoomDto {
    @IsString()
    userId: string

    @IsString()
    serviceProvider: string

    @IsEnum(ChatStatus)
    status: ChatStatus

    // @ValidateNested({each: true})
    // messages: MessageDto[]
}


export class MessageDto {
    @IsString()
    chatRoomId: string

    @IsString()
    content: string
    
    @IsBoolean()
    seen: boolean

}