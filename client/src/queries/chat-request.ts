import { apiClient } from '@/lib'
import { ChatRequest } from '@/types'

export async function createChatRequest(serviceId: string) {
  const { data } = await apiClient.post<ChatRequest>('/chat-request', { serviceId })
  return data
}
