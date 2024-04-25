import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator'
import { omit } from 'remeda'

export class SigninDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class SignupDto {
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

  @IsEnum(omit(Role, ['ADMIN']), { message: 'Invalid role provided!' })
  role: 'CLIENT' | 'SERVICE_PROVIDER'

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string
}
