import { apiClient } from '@/lib'
import { UpdateUserSchema } from '@/schema'
import { User } from '@/types'

export async function updateUser(dto: UpdateUserSchema) {
  const { data } = await apiClient.patch<User>('/users', dto)
  return data
}
