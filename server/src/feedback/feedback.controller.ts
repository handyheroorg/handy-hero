import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { Role } from 'src/auth/guards/role.decorator'
import { User } from 'src/users/users.decorator'
import { SanitizedUser } from 'src/users/users.types'
import { FeedbackService } from './feedback.service'
import { CreateFeedbackDto } from './feedback.dto'

@UseGuards(JwtAuthGuard)
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Role('CLIENT')
  createFeedback(@Body() dto: CreateFeedbackDto, @User() user: SanitizedUser) {
    return this.feedbackService.createFeedback(dto, user)
  }

  @Get('by-service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    return this.feedbackService.findByService(serviceId)
  }

  @Get('by-provider/:providerId')
  findByProvider(@Param('providerId') providerId: string) {
    return this.feedbackService.findByProvider(providerId)
  }
}
