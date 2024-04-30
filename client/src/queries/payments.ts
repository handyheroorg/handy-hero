import { apiClient } from '@/lib'
import { CreateCardSchema } from '@/schema'

export async function createCard(dto: CreateCardSchema) {
  const { data } = await apiClient.post('/payments/create-card', dto)
  return data
}

export async function createPayment() {
  const { data } = await apiClient.post('/payments/create-payment')
  return data
}
