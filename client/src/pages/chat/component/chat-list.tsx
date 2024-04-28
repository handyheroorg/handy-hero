import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BasicProps, Message } from '@/types'
import { cn } from '@/lib'
import { useAuthenticatedUser } from '@/hooks'
import NewMessageForm from './new-message-form'

type ChatListProps = BasicProps & {
  messages: Message[]
  sendMessage: (newMessage: string) => void
}

export default function ChatList({ className, style, messages, sendMessage }: ChatListProps) {
  const { user } = useAuthenticatedUser()
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(
    function scrollToTop() {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      }
    },
    [messages],
  )

  return (
    <div className={cn('w-full overflow-y-auto overflow-x-hidden h-full flex flex-col', className)} style={style}>
      <div ref={messagesContainerRef} className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isCurrentUserSender = message.sentById === user.id

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: 'spring',
                    bounce: 0.3,
                    duration: messages.indexOf(message) * 0.05 + 0.2,
                  },
                }}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                }}
                className={cn(
                  'flex flex-col gap-2 p-4 whitespace-pre-wrap',
                  isCurrentUserSender ? 'items-end' : 'items-start',
                )}
              >
                <div className="flex gap-3 items-center">
                  <span
                    className={cn(
                      ' bg-accent p-3 rounded-full max-w-xs',
                      isCurrentUserSender && 'bg-primary/5 border-primary border text-primary',
                    )}
                  >
                    {message.content}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <NewMessageForm
        onSubmit={(data) => {
          sendMessage(data.message)
        }}
      />
    </div>
  )
}
