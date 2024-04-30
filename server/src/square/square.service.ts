import * as crypto from 'crypto'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Client, Environment } from 'square'
import { ConfigService } from '@nestjs/config'
import { Environment as EnvironmentVars } from 'src/config/config.options'
import { SanitizedUser } from 'src/users/users.types'
import { omit } from 'remeda'
import { ContractService } from 'src/contract/contract.service'
import { CreateCardDto, CreateCustomerDto } from './square.dto'

@Injectable()
export class SquareService {
  square: Client

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<EnvironmentVars>,
    private readonly contractService: ContractService,
  ) {
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

  async findCardForUser(userId: string) {
    const card = await this.prisma.card.findFirst({ where: { userId } })
    if (!card) {
      throw new NotFoundException('Payment is not verified yet!')
    }

    return card
  }

  /**
   * There is not any implemented method in Square Payment API by which we
   * can do peer-to-peer transactions, that's why we are using a hack to
   * enable the transactions between client and service provider.
   * In future, we will look forward for more better options.
   */
  async releasePaymentToProvider(contractId: string, user: SanitizedUser) {
    const contract = await this.contractService.findOneById(contractId, user)

    if (!contract.serviceProvider.isPaymentVerified) {
      throw new BadRequestException("Service provider's payment method is not verified!")
    }

    if (!user.isPaymentVerified) {
      throw new BadRequestException('Your payment method is not verified!')
    }

    const clientCard = await this.findCardForUser(user.id)
    const providerCard = await this.findCardForUser(contract.serviceProvider.id)

    try {
      /**
       * Step 1.
       * When client release a payment, the amount is credited in merchant's (our) account
       */
      const payment = await this.square.paymentsApi.createPayment({
        idempotencyKey: crypto.randomUUID(),
        sourceId: clientCard.squareCardId,
        amountMoney: {
          amount: BigInt(contract.settledPrice),
          currency: 'USD',
        },
        autocomplete: true,
        customerId: user.squareCustomerId,
        locationId: this.configService.get('SQUARE_LOCATION_ID'),
      })

      if (payment.result.payment.status !== 'COMPLETED') {
        throw new InternalServerErrorException('Something went wrong while doing transaction, please try again later!')
      }

      /**
       * Step 2.
       * We initiate an unlinked refund immediately, so that the amount
       * is credited into service provider's card.
       */
      await this.square.refundsApi.refundPayment({
        idempotencyKey: crypto.randomUUID(),
        destinationId: providerCard.squareCardId,
        amountMoney: {
          amount: BigInt(contract.settledPrice),
          currency: 'USD',
        },
        customerId: contract.serviceProvider.squareCustomerId,
        unlinked: true,
        reason: `Payment from ${user.fullName} for service ${contract.service.name}`,
        locationId: this.configService.get('SQUARE_LOCATION_ID'),
      })

      return this.prisma.payment.create({
        data: {
          amount: contract.settledPrice,
          squarePaymentId: payment.result.payment.id,
          client: { connect: { id: user.id } },
          provider: { connect: { id: contract.serviceProviderId } },
          contract: { connect: { id: contract.id } },
        },
      })
    } catch {
      throw new InternalServerErrorException('Something went wrong while doing transaction, please try again later!')
    }
  }
}
