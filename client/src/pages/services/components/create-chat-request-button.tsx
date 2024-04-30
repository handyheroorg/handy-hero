import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui'
import { useAuthenticatedUser } from '@/hooks'
import { BasicProps, Role, Service } from '@/types'
import { createChatRequest } from '@/queries'
import { cn, handleError } from '@/lib'

type CreateChatRequestButtonProps = BasicProps & {
  serviceId: string
  isChatRequestExists: boolean
}

export default function CreateChatRequestButton({
  className,
  style,
  serviceId,
  isChatRequestExists,
}: CreateChatRequestButtonProps) {
  const qc = useQueryClient()
  const { user } = useAuthenticatedUser()

  const createChatRequestMutation = useMutation({
    mutationFn: createChatRequest,
    onError: handleError,
    onSuccess: () => {
      qc.setQueryData<(Service & { isChatRequestExists: boolean }) | undefined>(['service', serviceId], (prev) => {
        if (!prev) return

        return {
          ...prev,
          isChatRequestExists: true,
        }
      })
      toast.success('Chat request created successfully!')
    },
  })

  if (user.role !== Role.CLIENT) {
    return null
  }

  if (isChatRequestExists) {
    return (
      <div className="text-center text-sm py-10 rounded-md bg-primary/10 px-4 text-primary">
        You have sent a chat request for this service
      </div>
    )
  }

  return (
    <Button
      className={cn('w-full', className)}
      style={style}
      loading={createChatRequestMutation.isPending}
      onClick={() => {
        createChatRequestMutation.mutate(serviceId)
      }}
    >
      Send Chat Request
    </Button>
  )
}
