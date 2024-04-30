import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { CreateCardDto } from './square.dto'
import { SquareService } from './square.service'

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class SquareController {
  constructor(private readonly squareService: SquareService) {}

  @Post('/create-card')
  createCard(@Body() dto: CreateCardDto, @User() user: SanitizedUser) {
    return this.squareService.createCard(dto, user)
  }

  @UseGuards(RoleGuard)
  @Role('CLIENT')
  @Post('/release/:contractId')
  releasePaymentToProvider(@Param('contractId') contractId: string, @User() user: SanitizedUser) {
    return this.squareService.releasePaymentToProvider(contractId, user)
  }
}
