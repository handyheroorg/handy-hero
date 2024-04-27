import * as crypto from 'crypto'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Client, Environment } from 'square'
import { ConfigService } from '@nestjs/config'
import { Environment as EnvironmentVars } from 'src/config/config.options'
import { SanitizedUser } from 'src/users/users.types'
import { omit } from 'remeda'
import { CreateCardDto, CreateCustomerDto } from './square.dto'

@Injectable()
export class SquareService {
  square: Client

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService<EnvironmentVars>) {
    this.square = new Client({
      bearerAuthCredentials: {
        accessToken: this.configService.get('SQUARE_ACCESS_TOKEN'),
      },
      environment: Environment.Sandbox,
    })
  }

  async addCustomer(dto: CreateCustomerDto) {
    try {
      const { result, statusCode } = await this.square.customersApi.createCustomer(dto)

      if (statusCode !== 200) {
        throw new Error()
      }

      return result.customer
    } catch {
      throw new InternalServerErrorException('Something went wrong white signup, please try again later!')
    }
  }

  async createCard(dto: CreateCardDto, user: SanitizedUser) {
    try {
      const { result, statusCode } = await this.square.cardsApi.createCard({
        idempotencyKey: crypto.randomUUID(),
        sourceId: dto.token,
        card: {
          cardBrand: dto.brand,
          customerId: user.squareCustomerId,
          expMonth: BigInt(dto.expMonth),
          expYear: BigInt(dto.expYear),
          last4: dto.last4,
        },
      })

      if (statusCode !== 200) {
        throw new InternalServerErrorException('Something went wrong while adding card, please try again later!')
      }

      const { id, cardBrand, enabled, expMonth, expYear, last4, ...metadata } = result.card

      const [cardCreated] = await Promise.all([
        this.prisma.card.create({
          data: {
            squareCardId: id,
            brand: cardBrand,
            last4,
            expMonth,
            expYear,
            enabled,
            metadata: omit(metadata, ['version', 'billingAddress']),
            user: { connect: { id: user.id } },
          },
        }),
        this.prisma.user.update({ where: { id: user.id }, data: { isPaymentVerified: true } }),
      ])

      return { id: cardCreated.id, brand: cardCreated.brand }
    } catch {
      throw new InternalServerErrorException('Something went wrong while adding card, please try again later!')
    }
  }
}
