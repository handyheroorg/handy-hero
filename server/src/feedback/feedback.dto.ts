import { IsInt, IsMongoId, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'

export class CreateFeedbackDto {
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number

  @IsMongoId()
  serviceId: string
}
