import { IsNumber, IsPositive, IsString, Length } from 'class-validator'

export type CreateCustomerDto = {
  givenName: string
  familyName: string
  emailAddress: string
}

export class CreateCardDto {
  @IsString()
  token: string

  @IsString()
  brand: string

  @IsNumber()
  @IsPositive()
  expMonth: number

  @IsNumber()
  @IsPositive()
  expYear: number

  @IsString()
  @Length(4, 4)
  last4: string
}
