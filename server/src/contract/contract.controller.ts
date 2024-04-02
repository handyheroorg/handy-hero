import { Controller, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ContractService } from './contract.service'

@UseGuards(JwtAuthGuard)
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}
}
