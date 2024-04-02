import { IsMongoId, IsNumber, IsString } from 'class-validator'

export class CreateContractDto {
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
