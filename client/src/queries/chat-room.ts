import { apiClient } from '@/lib'
import { ChatRoom } from '@/types'

export async function fetchChatRooms() {
  const { data } = await apiClient.get<ChatRoom[]>('/chat-rooms')
  return data
}

export async function fetchChatRoom(id: string) {
  const { data } = await apiClient.get<ChatRoom>(`/chat-rooms/${id}`)
  return data
}
