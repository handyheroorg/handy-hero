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
  messages: Message[]
}

export type ChatRoomStatus = 'IN_PROGESS' | 'CLOSED' | 'PROPOSAL_CREATED' | 'CONTRACT_AWARDED'

export type RoomJoinedData = {
  userId: string
  socketId: string
}

export type Message = Timestamps & {
  id: string
  content: string
  seen: boolean
  sentBy: User
  sentById: string
  chatRoom: ChatRoom
  chatRoomId: string
}

export type NewMessageData = Message
