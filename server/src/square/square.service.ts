import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Client, Environment } from 'square'
import { ConfigService } from '@nestjs/config'
import { Environment as EnvironmentVars } from 'src/config/config.options'
import { CreateCustomerDto } from './square.dto'

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
}
