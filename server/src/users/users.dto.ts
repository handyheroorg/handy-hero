import { ExperienceLevel, Role } from '@prisma/client'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string

  @IsEmail()
  email: string

  /** @TODO : Figure out validation for mobile number for different countries */
  @IsString()
  mobileNumber: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  country: string

  @IsEnum(Role)
  role: Role

  @IsString()
  @MinLength(8)
  @MaxLength(400)
  password: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string

  /** @TODO : Figure out validation for mobile number for different countries */
  @IsOptional()
  @IsString()
  mobileNumber?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
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

export class EducationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  school: string

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  degree: string

  @IsOptional()
  @IsString()
  @MinLength(3)
  fieldOfStudy?: string

  @IsDateString()
  startDate: string

  @IsDateString()
  endDate: string

  @IsOptional()
  @IsString()
  description: string
}

enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
  TRAINEE = 'TRAINEE',
}

export class ExperienceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string

  @IsEnum(EmploymentType)
  employmentType: EmploymentType

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  company: string

  @IsDateString()
  startDate: string

  @IsBoolean()
  currentlyWorkingHere?: boolean

  @IsDateString()
  @ValidateIf((values) => values.currentlyWorkingHere === false)
  endDate: string

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  industry: string

  @IsOptional()
  @IsString()
  description: string
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  occupation?: string

  @IsOptional()
  @IsString()
  about?: string

  @IsOptional()
  @IsString()
  fullAddress?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills: string[]

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education: EducationDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience: ExperienceDto[]
}
