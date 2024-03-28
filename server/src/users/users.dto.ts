import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUrl, Max, Min, MinLength } from 'class-validator'

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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string

  /** @TODO : Figure out validation for mobile number for different countries */
  @IsOptional()
  @IsString()
  mobileNumber?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  country?: string

  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string
}

export class UpdateLocationDto {
  @IsNumber()
  @Min(-90, { message: 'Invalid value provided!' })
  @Max(90, { message: 'Invalid value provided!' })
  latitude: number

  @IsNumber()
  @Min(-180, { message: 'Invalid value provided!' })
  @Max(180, { message: 'Invalid value provided!' })
  longitude: number
}
