import { Controller } from '@nestjs/common'
import { SquareService } from './square.service'

@Controller('payments')
export class SquareController {
  constructor(private readonly squareService: SquareService) {}
}
