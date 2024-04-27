import { ProposalStatus } from '@prisma/client'
import { IsEnum, IsNumber, IsPositive, IsString, Min, MinLength } from 'class-validator'
import { omit } from 'remeda'

export class NewContractProposalDto {
  @IsString()
  @MinLength(2)
  title: string

  @IsString()
  @MinLength(10)
  description: string

  @IsNumber()
  @IsPositive()
  @Min(0.1)
  settledPrice: number
}

export class ProcessContractProposalDto {
  @IsEnum(omit(ProposalStatus, ['PENDING']))
  status: 'ACCEPTED' | 'REJECTED'
}
