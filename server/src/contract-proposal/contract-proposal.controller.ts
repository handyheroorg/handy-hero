import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { ContractProposalService } from './contract-proposal.service'
import { NewContractProposalDto, ProcessContractProposalDto } from './contract-proposal.dto'

@UseGuards(JwtAuthGuard)
@Controller('contract-proposal')
export class ContractProposalController {
  constructor(private readonly contractProposalService: ContractProposalService) {}

  @UseGuards(RoleGuard)
  @Role('CLIENT')
  @Post(':chatRoomId')
  createProposal(
    @Param('chatRoomId') chatRoomId: string,
    @Body() dto: NewContractProposalDto,
    @User() user: SanitizedUser,
  ) {
    return this.contractProposalService.createProposal(chatRoomId, dto, user)
  }

  @UseGuards(RoleGuard)
  @Role('SERVICE_PROVIDER')
  @Patch(':id')
  processProposal(@Param('id') id: string, @Body() dto: ProcessContractProposalDto, @User() user: SanitizedUser) {
    return this.contractProposalService.processProposal(id, dto, user)
  }
}
