import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Novu } from '@novu/node'
import { Environment } from 'src/config/config.options'
import { NewNotificationPayload, NewSubscriber } from './notification.types'

const WORKFLOW_ID = 'in-app-notifications'

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

  async sendNotification(subscriberId: string, payload: NewNotificationPayload) {
    try {
      await this.novu.trigger(WORKFLOW_ID, { to: subscriberId, payload })
      return { success: true }
    } catch {
      return { success: false }
    }
  }
}
