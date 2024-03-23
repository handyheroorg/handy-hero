import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  fullName: string

  @IsEmail()
  email: string

  @IsEnum(Role)
  role: Role

  @IsString()
  @MinLength(8)
  password: string
}
