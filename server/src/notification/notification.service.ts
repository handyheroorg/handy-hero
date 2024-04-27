import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Novu } from '@novu/node'
import { Environment } from 'src/config/config.options'
import { omit } from 'remeda'
import { NewEmailInAppPayload, NewNotificationPayload, NewSubscriber, UpdateSubscriber } from './notification.types'

const IN_APP_WORKFLOW_ID = 'in-app-notifications'
const EMAIL_IN_APP_WORKFLOW_ID = 'email-and-in-app'

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

  async updateSubscriber(subscriberId: string, data: UpdateSubscriber) {
    try {
      await this.novu.subscribers.update(subscriberId, data)
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  /**
   * Send in-app notifications
   */
  async sendNotification(subscriberId: string, payload: NewNotificationPayload) {
    try {
      await this.novu.trigger(IN_APP_WORKFLOW_ID, { to: subscriberId, payload })
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  /**
   * Important updates should also be posted via email,
   * This method will post notification via email and in-app as well
   */
  async sendEmailAndInApp(data: NewEmailInAppPayload) {
    try {
      await this.novu.trigger(EMAIL_IN_APP_WORKFLOW_ID, {
        to: {
          subscriberId: data.receiverId,
          email: data.receiverEmail,
        },
        payload: omit(data, ['subscriberId', 'receiverEmail']),
      })
    } catch {
      return { success: false }
    }
  }
}
