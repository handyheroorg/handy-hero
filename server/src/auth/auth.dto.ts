import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator'

export class SigninDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

enum SignupRoles {
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export class SignupDto {
  @IsString()
  @MinLength(2)
  fullName: string

  @IsEmail()
  email: string

  @IsEnum(SignupRoles, { message: 'Invalid role provided!' })
  role: SignupRoles

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string
}
