import { match } from 'ts-pattern'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthenticatedUser } from '@/hooks'
import { cn, handleError } from '@/lib'
import { BasicProps, ChatRequest, ChatRequestStatus, ProcessChatRequestDto, Role } from '@/types'
import { Button } from '@/components/ui'
import { processChatRequest } from '@/queries'

type ChatRequestActionsProps = BasicProps & {
  id: string
}

export default function ChatRequestActions({ className, style, id }: ChatRequestActionsProps) {
  const { user } = useAuthenticatedUser()
  const qc = useQueryClient()

  const processChatRequestMutation = useMutation({
    mutationFn: (dto: ProcessChatRequestDto) => processChatRequest(id, dto),
    onError: handleError,
    onSuccess: (_, data) => {
      qc.setQueryData<ChatRequest[]>(['chat-requests'], (prev) => {
        if (!prev) return []

        return prev.filter((request) => request.id !== id)
      })

      toast.success(`Chat request ${data.status.toLowerCase()} successfully!`)
    },
  })

  return (
    <div className={cn('flex items-center gap-2', className)} style={style}>
      {match(user.role)
        .with(Role.ADMIN, () => null)
        .with(Role.CLIENT, () => <Button variant="destructive">Delete</Button>)
        .with(Role.SERVICE_PROVIDER, () => (
          <>
            <Button
              loading={processChatRequestMutation.isPending}
              onClick={() => {
                processChatRequestMutation.mutate({ status: ChatRequestStatus.ACCEPTED })
              }}
            >
              Accept
            </Button>
            <Button
              loading={processChatRequestMutation.isPending}
              variant="destructive-outline"
              onClick={() => {
                processChatRequestMutation.mutate({ status: ChatRequestStatus.REJECTED })
              }}
            >
              Reject
            </Button>
          </>
        ))
        .exhaustive()}
    </div>
  )
}
