export type ProviderDashboardStats = {
  acceptedChatRequests: number
  onGoingContracts: number
  pendingChatRequests: number
  rejectedChatRequests: number
  pendingProposals: number
}

export type ClientDashboardStats = {
  sentChatRequests: number
  acceptedChatRequest: number
  rejectedChatRequests: number
  onGoingContracts: number
}
