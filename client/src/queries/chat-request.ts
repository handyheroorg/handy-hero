import { apiClient } from '@/lib'
import { ChatRequest, ProcessChatRequestDto } from '@/types'

export async function createChatRequest(serviceId: string) {
  const { data } = await apiClient.post<ChatRequest>('/chat-request', { serviceId })
  return data
}

export async function findChatRequests() {
  const { data } = await apiClient.get<ChatRequest[]>('/chat-request')
  return data
}

export async function processChatRequest(id: string, dto: ProcessChatRequestDto) {
  const { data } = await apiClient.post<ChatRequest>(`/chat-request/process/${id}`, dto)
  return data
}
