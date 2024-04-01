import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { ContractProposalService } from './contract-proposal.service'
import { NewContractProposalDto } from './contract-proposal.dto'

@UseGuards(JwtAuthGuard)
@Controller('contract-proposal')
export class ContractProposalController {
  constructor(private readonly contractProposalService: ContractProposalService) {}

  @UseGuards(RoleGuard)
  @Role('SERVICE_PROVIDER')
  @Post(':chatRoomId')
  createProposal(
    @Param('chatRoomId') chatRoomId: string,
    @Body() dto: NewContractProposalDto,
    @User() user: SanitizedUser,
  ) {
    return this.contractProposalService.createProposal(chatRoomId, dto, user)
  }
}
