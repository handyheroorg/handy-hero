import { LoginSchema, SignupSchema } from '@/schema'
import { apiClient } from '@/lib'
import { User } from '@/types'

export async function signup(dto: SignupSchema) {
  const { data } = await apiClient.post<{ access_token: string }>('/auth/signup', dto)
  return data
}

export async function login(dto: LoginSchema) {
  const { data } = await apiClient.post<{ access_token: string }>('/auth/login', dto)
  return data
}

export async function fetchLoggedInUser() {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}
