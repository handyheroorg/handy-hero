import { Avatar, AvatarImage } from '@/components/ui'
import { useAuthenticatedUser } from '@/hooks'
import { cn } from '@/lib'
import { BasicProps, ChatRoomStatus, Role, User } from '@/types'
import MakeOfferDialog from './make-offer-dialog'

type ChatTopBarProps = BasicProps & {
  selectedUser: User
  chatRoomId: string
  servicePrice: number
  status: ChatRoomStatus
}

export default function ChatTopBar({ className, style, selectedUser, ...makeOfferProps }: ChatTopBarProps) {
  const { user } = useAuthenticatedUser()

  return (
    <div className={cn('w-full h-20 flex p-4 justify-between items-center border-b', className)} style={style}>
      <div className="flex items-center gap-2">
        {!!selectedUser.avatar?.publicUrl && (
          <Avatar className="flex justify-center items-center">
            <AvatarImage
              src={selectedUser.avatar?.publicUrl}
              alt={selectedUser.fullName}
              width={6}
              height={6}
              className="w-10 h-10 "
            />
          </Avatar>
        )}
        <h1 className="text-2xl font-medium">{selectedUser.fullName}</h1>
      </div>

      {user.role === Role.CLIENT && <MakeOfferDialog {...makeOfferProps} />}
    </div>
  )
}
