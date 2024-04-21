import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui'
import { cn, handleError } from '@/lib'
import { processContractProposal } from '@/queries'
import { ProcessContractProposalDto } from '@/schema'
import { BasicProps, ChatRoomStatus } from '@/types'

type ProcessContractProposalProps = BasicProps & {
  chatRoomId: string
  status: ChatRoomStatus
}

export default function ProcessContractProposal({
  className,
  style,
  chatRoomId,
  status,
}: ProcessContractProposalProps) {
  const navigate = useNavigate()

  const processProposalMutation = useMutation({
    mutationFn: (dto: ProcessContractProposalDto) => processContractProposal(chatRoomId, dto),
    onError: handleError,
    onSuccess: (_, data) => {
      if (data.status === 'ACCEPTED') {
        navigate('/congratulations')
      } else {
        navigate('/provider/dashboard')
      }

      toast.success(`Proposal ${data.status.toLowerCase()} successfully!`)
    },
  })

  if (status !== 'PROPOSAL_CREATED') {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2', className)} style={style}>
      <Button
        loading={processProposalMutation.isPending}
        onClick={() => {
          processProposalMutation.mutate({ status: 'ACCEPTED' })
        }}
      >
        Accept Proposal
      </Button>
      <Button
        variant="destructive-outline"
        loading={processProposalMutation.isPending}
        onClick={() => {
          processProposalMutation.mutate({ status: 'REJECTED' })
        }}
      >
        Reject Proposal
      </Button>
    </div>
  )
}
