import { Controller, Get, UseGuards } from '@nestjs/common'
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
}
