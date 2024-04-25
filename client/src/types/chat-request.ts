import { Service } from './service'
import { User } from './user'

export type ChatRequest = {
  id: string
  status: ChatRequestStatus
  clientId: string
  serviceProviderId: string
  serviceId: string
  createdAt: Date
  updatedAt: Date
  service: Service
  client: User
  serviceProvider: User
}

export enum ChatRequestStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export type ProcessChatRequestDto = { status: Omit<ChatRequestStatus, 'PENDING'> }
