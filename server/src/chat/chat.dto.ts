import { ChatStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsBoolean, IsEmail, IsEnum, IsString, MinLength, ValidateNested } from 'class-validator'

export class ChatDto {
    @IsString()
    userId: string

    @IsString()
    servicePrividerId: string

    @IsEnum(ChatStatus)
    status: ChatStatus    
}

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