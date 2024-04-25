import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { ContractService } from './contract.service'

@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  findAll(@User() user: SanitizedUser) {
    return this.contractService.findAll(user)
  }

  @Get(':id')
  findOneById(@Param('id') id: string, @User() user: SanitizedUser) {
    return this.contractService.findOneById(id, user)
  }

  @Post('end/:id')
  endContract(@Param('id') id: string, @User() user: SanitizedUser) {
    return this.contractService.endContract(id, user)
  }
}
