import { ChatRoom } from './chat-room'
import { Service } from './service'
import { Timestamps } from './timestamp'
import { User } from './user'

export type ContractProposal = Timestamps & {
  id: string
  title: string
  description: string
  chatRoomId: string
  settledPrice: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  chatRoom: ChatRoom
}

export type Contract = Timestamps & {
  id: string
  title: string
  description: string
  status: 'ON_GOING' | 'COMPLETED'
  settledPrice: number
  clientId: string
  serviceProviderId: string
  serviceId: string
  service: Service
  client: User
  serviceProvider: User
}
