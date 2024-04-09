import { apiClient } from '@/lib'
import { CreateServiceSchema } from '@/schema'
import { Service } from '@/types'

export async function createService(dto: CreateServiceSchema) {
  const { data } = await apiClient.post<Service>('/services', dto)
  return data
}
