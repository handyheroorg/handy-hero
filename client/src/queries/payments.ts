import { apiClient } from '@/lib'
import { CreateCardSchema } from '@/schema'

export async function createCard(dto: CreateCardSchema) {
  const { data } = await apiClient.post('/payments/create-card', dto)
  return data
}

export async function releasePayment(contractId: string) {
  const { data } = await apiClient.post(`/payments/release/${contractId}`)
  return data
}
