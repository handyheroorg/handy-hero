import { ProposalStatus } from '@prisma/client'
import { IsEnum, IsNumber, IsPositive, Min } from 'class-validator'
import { omit } from 'remeda'

export class NewContractProposalDto {
  @IsNumber()
  @IsPositive()
  @Min(0.1)
  settledPrice: number
}

export class ProcessContractProposalDto {
  @IsEnum(omit(ProposalStatus, ['PENDING']))
  status: 'ACCEPTED' | 'REJECTED'
}
