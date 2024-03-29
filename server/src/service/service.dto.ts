import { ServicePriceType } from '@prisma/client'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator'
import { PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateServiceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  name: string

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description?: string

  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnail?: string

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  skills: string[]

  @IsNumber()
  @IsPositive()
  @Min(0.1)
  @Max(999999999)
  price: number

  @IsEnum(ServicePriceType)
  priceType: ServicePriceType

  @IsNumber()
  @IsPositive()
  @ValidateIf((values) => values.priceType === ServicePriceType.HOURLY)
  maxHours: number
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class FindServicesFiltersDto {
  @IsOptional()
  @IsString()
  query?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number

  @IsOptional()
  @IsEnum(ServicePriceType)
  priceType?: ServicePriceType
}
