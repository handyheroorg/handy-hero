import { apiClient } from '@/lib'
import { UpdateUserSchema } from '@/schema'
import { Location, User } from '@/types'

export async function updateUser(dto: UpdateUserSchema) {
  const { data } = await apiClient.patch<User>('/users', dto)
  return data
}

export async function updateLocation(dto: { latitude: number; longitude: number }) {
  const { data } = await apiClient.patch<Location>('/users/location', dto)
  return data
}
