import { useAuthenticatedUser } from '@/hooks'
import { cn } from '@/lib'
import { BasicProps, Message } from '@/types'

type MessagesProps = BasicProps & {
  messages: Message[]
}

export function Messages({ className, style, messages }: MessagesProps) {
  const { user } = useAuthenticatedUser()

  return (
    <div className={cn('flex p-4 flex-col gap-y-4 max-h-[900px] overflow-y-auto', className)} style={style}>
      {messages.map((message, i) => {
        const isSender = message.sentById === user.id

        return (
          <div
            key={message.id ?? i}
            className={cn(
              'px-6 py-2 rounded-full bg-gray-50 w-max border border-transparent max-w-[500px]',
              isSender && 'bg-primary/10 border-primary/50 text-primary self-end',
            )}
          >
            {message.content}
          </div>
        )
      })}
    </div>
  )
}
