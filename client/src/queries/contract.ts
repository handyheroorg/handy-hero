import { apiClient } from '@/lib'
import { CreateContractProposalSchema, ProcessContractProposalDto } from '@/schema'
import { Contract, ContractProposal } from '@/types'

/**
 * Contract Proposal
 */
export async function createContractProposal(chatRoomId: string, dto: CreateContractProposalSchema) {
  const { data } = await apiClient.post(`/contract-proposal/${chatRoomId}`, dto)
  return data
}

export async function processContractProposal(chatRoomId: string, dto: ProcessContractProposalDto) {
  const { data } = await apiClient.patch(`/contract-proposal/${chatRoomId}`, dto)
  return data
}

export async function fetchContractProposal(chatRoomId: string) {
  const { data } = await apiClient.get<ContractProposal>(`/contract-proposal/${chatRoomId}`)
  return data
}

export async function fetchContractProposals() {
  const { data } = await apiClient.get<ContractProposal[]>('/contract-proposal')
  return data
}

/**
 * Contracts
 */
export async function fetchContracts() {
  const { data } = await apiClient.get<Contract[]>('/contracts')
  return data
}

export async function fetchContract(id: string) {
  const { data } = await apiClient.get<Contract>(`/contracts/${id}`)
  return data
}

export async function endContract(id: string) {
  const { data } = await apiClient.post<Contract>(`/contracts/end/${id}`)
  return data
}
