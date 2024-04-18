export type ChatRequest = {
  id: string
  status: ChatRequestStatus
  clientId: string
  serviceProviderId: string
  serviceId: string
  createdAt: Date
  updatedAt: Date
}

export enum ChatRequestStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}
