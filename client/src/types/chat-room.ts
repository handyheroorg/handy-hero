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
  status: ChatRoomStatus
}

export type ChatRoomStatus = 'IN_PROGESS' | 'CLOSED' | 'PROPOSAL_CREATED' | 'CONTRACT_AWARDED'
