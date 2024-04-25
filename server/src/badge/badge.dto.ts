import { PartialType, PickType } from '@nestjs/swagger'
import { BadgeType } from '@prisma/client'
import { IsEnum, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'

export class CreateBadgeDto {
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  title: string

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description: string

  @IsString()
  @IsUrl()
  icon: string

  @IsEnum(BadgeType)
  type: BadgeType
}

export class BadgeFiltersDto extends PartialType(PickType(CreateBadgeDto, ['type'])) {}
