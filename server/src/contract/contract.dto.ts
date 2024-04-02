import { IsMongoId, IsNumber, IsString } from 'class-validator'

export class CreateContractDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  @IsMongoId()
  clientId: string

  @IsString()
  @IsMongoId()
  serviceProviderId: string

  @IsString()
  @IsMongoId()
  serviceId: string

  @IsNumber()
  settledPrice: number
}
