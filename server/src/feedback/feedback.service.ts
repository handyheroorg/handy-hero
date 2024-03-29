import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SanitizedUser } from 'src/users/users.types'
import { ServiceService } from 'src/service/service.service'
import { omit } from 'remeda'
import { UsersService } from 'src/users/users.service'
import { CreateFeedbackDto } from './feedback.dto'
import { FEEDBACK_INCLUDE_FIELDS } from './feedback.fields'

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceService: ServiceService,
    private readonly userService: UsersService,
  ) {}

  findByClientAndService(clientId: string, serviceId: string) {
    return this.prisma.feedback.findFirst({ where: { clientId, serviceId } })
  }

  async createFeedback(dto: CreateFeedbackDto, user: SanitizedUser) {
    const service = await this.serviceService.findById(dto.serviceId)

    const feedback = await this.findByClientAndService(user.id, dto.serviceId)
    if (feedback) {
      throw new BadRequestException('You have already given a feedback on this service!')
    }

    /** @TODO Only allow to give feedback if the client have a contract for the service  */

    return this.prisma.feedback.create({
      data: {
        ...omit(dto, ['serviceId']),
        service: { connect: { id: service.id } },
        profile: { connect: { id: service.profileId } },
        client: { connect: { id: user.id } },
      },
    })
  }

  findByService(serviceId: string) {
    return this.prisma.feedback.findMany({ where: { serviceId }, include: FEEDBACK_INCLUDE_FIELDS })
  }

  async findByProvider(providerId: string) {
    const profile = await this.userService.findProfile(providerId)

    return this.prisma.feedback.findMany({ where: { profileId: profile.id }, include: FEEDBACK_INCLUDE_FIELDS })
  }
}
