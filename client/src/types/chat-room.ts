import { Service } from './service'
import { Timestamps } from './timestamp'
import { User } from './user'

export type ChatRoom = Timestamps & {
  id: string
  client: User
  clientId: string
  provider: User
  providerId: string
  service: Service
  serviceId: string
}
