import { Service } from './service'
import { Timestamps } from './timestamp'
import { User } from './user'

export type ContractProposal = Timestamps & {
  id: string
  title: string
  description: string
  chatRoomId: string
  settledPrice: 40
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
