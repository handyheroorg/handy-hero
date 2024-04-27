import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
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
}
