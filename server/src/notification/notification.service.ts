import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Novu } from '@novu/node'
import { Environment } from 'src/config/config.options'
import { NewSubscriber } from './notification.types'

@Injectable()
export class NotificationService {
  novu: Novu

  constructor(private readonly configService: ConfigService<Environment>) {
    this.novu = new Novu(configService.get('NOVU_API_KEY'))
  }

  async addSubscriber(subscriberId: string, data: NewSubscriber) {
    try {
      await this.novu.subscribers.identify(subscriberId, data)
      return { success: true }
    } catch {
      return { success: false }
    }
  }
}
