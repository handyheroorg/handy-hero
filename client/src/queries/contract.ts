import { apiClient } from '@/lib'
import { CreateContractProposalSchema } from '@/schema'

export async function createContractProposal(chatRoomId: string, dto: CreateContractProposalSchema) {
  const { data } = await apiClient.post(`/contract-proposal/${chatRoomId}`, dto)
  return data
}
