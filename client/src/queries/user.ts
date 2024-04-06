import { apiClient } from '@/lib'
import { UpdateUserSchema } from '@/schema'
import { Location, Profile, User } from '@/types'

export async function updateUser(dto: UpdateUserSchema) {
  const { data } = await apiClient.patch<User>('/users', dto)
  return data
}

export async function updateLocation(dto: { latitude: number; longitude: number }) {
  const { data } = await apiClient.patch<Location>('/users/location', dto)
  return data
}

export async function fetchUserProfile() {
  const { data } = await apiClient.get<Profile>('/users/profile')
  return data
}