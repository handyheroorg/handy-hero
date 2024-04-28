import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { NavLink } from 'react-router-dom'
import { cn, getErrorMessage } from '@/lib'
import { BasicProps, Role } from '@/types'
import { fetchChatRooms } from '@/queries'
import ErrorMessage from '../error-message'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  buttonVariants,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui'
import { useAuthenticatedUser } from '@/hooks'
import EmptyMessage from '../empty-message'

type ChatRoomsProps = BasicProps & {
  isCollapsed?: boolean
}

export default function ChatRooms({ className, style, isCollapsed }: ChatRoomsProps) {
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
        return <EmptyMessage description="You don't have any chat rooms yet." />
      }

      return (
        <div
          data-collapsed={isCollapsed}
          className={cn('relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2', className)}
          style={style}
        >
          {!isCollapsed && (
            <div className="flex gap-2 items-center text-2xl p-2">
              <p className="font-medium">Chats</p>
              <span className="text-zinc-300">({data.length})</span>
            </div>
          )}
          <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {data.map((room, index) => {
              const secondPerson = user.role === Role.CLIENT ? room.provider : room.client
              const to = `/chat/room/${room.id}`

              return isCollapsed ? (
                <TooltipProvider key={index}>
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          cn(
                            buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'icon' }),
                            'h-11 w-11 md:h-16 md:w-16',
                          )
                        }
                      >
                        <Avatar className="flex justify-center items-center">
                          <AvatarImage
                            src={secondPerson.avatar?.publicUrl}
                            alt={secondPerson.fullName}
                            width={6}
                            height={6}
                            className="w-10 h-10 "
                          />
                          <AvatarFallback>{secondPerson.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">{secondPerson.fullName}</span>
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-4">
                      {secondPerson.fullName}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <NavLink
                  key={index}
                  to={to}
                  className={({ isActive }) =>
                    cn(buttonVariants({ variant: isActive ? 'default' : 'ghost' }), 'justify-start gap-4')
                  }
                >
                  {!!secondPerson.avatar?.publicUrl && (
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={secondPerson.avatar?.publicUrl}
                        alt={secondPerson.fullName}
                        width={6}
                        height={6}
                        className="w-10 h-10 "
                      />
                    </Avatar>
                  )}
                  <div className="max-w-28">{secondPerson.fullName}</div>
                </NavLink>
              )
            })}
          </nav>
        </div>
      )
    })
    .exhaustive()
}
