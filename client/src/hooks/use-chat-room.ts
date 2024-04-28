import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStoresAccessToken } from './use-auth'
import { env } from '@/lib'
import { Message, NewMessageData, RoomJoinedData } from '@/types'
import { fetchChatRoom } from '@/queries'

const socket = io(env.VITE_SOCKET_URL, {
  extraHeaders: {
    Authorization: `Bearer ${getStoresAccessToken()}`,
  },
})

export function useChatRoom(roomId: string) {
  const chatRoomQuery = useQuery({
    queryKey: ['chat-room', roomId],
    queryFn: () => fetchChatRoom(roomId),
  })
  const [activeUsers, setActiveUsers] = useState<RoomJoinedData[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(
    function handleSocketMessages() {
      /** Join a room */
      socket.emit('join-room', { roomId })

      /** Room Joined */
      socket.on('room-joined', (data: RoomJoinedData) => {
        if (!activeUsers.find((u) => u.userId !== data.userId)) {
          setActiveUsers((prev) => [...prev, data])
        }
      })

      /** When received a new message */
      socket.on('message', (data: NewMessageData) => {
        setMessages((prev) => [...prev, data])
      })

      return () => {
        socket.off('join-room')
        socket.off('room-joined')
        socket.off('message')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roomId],
  )

  useEffect(
    function handleChatQuerySuccess() {
      if (chatRoomQuery.status === 'success' && chatRoomQuery.data) {
        setMessages(chatRoomQuery.data.messages)
      }
    },
    [chatRoomQuery.data, chatRoomQuery.status],
  )

  function sendNewMessage(content: string) {
    socket.emit('message', { roomId, content })
  }

  return { activeUsers, sendNewMessage, messages, chatRoomQuery }
}
