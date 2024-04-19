import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { Link } from 'react-router-dom'
import { cn, getErrorMessage } from '@/lib'
import { BasicProps, Role } from '@/types'
import { fetchChatRooms } from '@/queries'
import ErrorMessage from '../error-message'
import { Skeleton } from '../ui'
import { useAuthenticatedUser } from '@/hooks'
import EmptyMessage from '../empty-message'

type ChatRoomsProps = BasicProps

export default function ChatRooms({ className, style }: ChatRoomsProps) {
  const { user } = useAuthenticatedUser()
  const chatRoomsQuery = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: fetchChatRooms,
  })

  return match(chatRoomsQuery)
    .with({ status: 'pending' }, () => (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex items-center justify-center">
        <ErrorMessage description={getErrorMessage(error)} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => {
      if (data.length === 0) {
        return (
          <EmptyMessage description="You don't have any chat rooms yet. Post more jobs to receive chat requests." />
        )
      }

      return (
        <div className={cn('border rounded-lg overflow-y-auto max-h-[600px]', className)} style={style}>
          <div className="p-4 bg-muted-foreground/5">
            <h1 className="text-lg font-bold">Your chat rooms</h1>
          </div>

          {data.map((room) => {
            const secondPerson = user.role === Role.CLIENT ? room.provider : room.client

            return (
              <Link
                key={room.id}
                className="border-b px-4 py-2 hover:bg-muted-foreground/5 cursor-pointer flex gap-2"
                to={`/chat/room/${room.id}`}
              >
                {secondPerson.avatar?.publicUrl && (
                  <img
                    src={secondPerson.avatar?.publicUrl}
                    alt={secondPerson.fullName}
                    className="size-10 rounded-full object-cover"
                  />
                )}

                <div>
                  <h1 className="text-lg">{secondPerson.fullName}</h1>
                  <p className="text-sm text-muted-foreground">{room.service.name}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )
    })
    .exhaustive()
}
