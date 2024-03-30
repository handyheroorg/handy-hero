import { ExperienceLevel, Role } from '@prisma/client'
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  fullName: string

  @IsEmail()
  email: string

  /** @TODO : Figure out validation for mobile number for different countries */
  @IsString()
  mobileNumber: string

  @IsString()
  @MinLength(2)
  country: string

  @IsEnum(Role)
  role: Role

  @IsString()
  @MinLength(8)
  password: string
}
