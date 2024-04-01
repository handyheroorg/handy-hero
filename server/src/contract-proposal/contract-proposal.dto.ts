import { IsNumber, IsPositive, Min } from 'class-validator'

export class NewContractProposalDto {
  @IsNumber()
  @IsPositive()
  @Min(0.1)
  settledPrice: number
}
