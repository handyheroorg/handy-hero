import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useState } from 'react'
import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { cn, getErrorMessage, handleError } from '@/lib'
import { fetchContractProposal, processContractProposal } from '@/queries'
import { ProcessContractProposalDto } from '@/schema'
import { BasicProps, ChatRoomStatus } from '@/types'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/error-message'

type ProcessContractProposalProps = BasicProps & {
  chatRoomId: string
  status: ChatRoomStatus
  servicePrice: number
}

export default function ProcessContractProposal({
  className,
  style,
  chatRoomId,
  status,
  servicePrice,
}: ProcessContractProposalProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const contractProposalQuery = useQuery({
    queryKey: ['contract-proposal', chatRoomId],
    queryFn: () => fetchContractProposal(chatRoomId),
    enabled: open,
  })

  const processProposalMutation = useMutation({
    mutationFn: (dto: ProcessContractProposalDto) => processContractProposal(chatRoomId, dto),
    onError: handleError,
    onSuccess: (_, data) => {
      if (data.status === 'ACCEPTED') {
        navigate('/congratulations')
      } else {
        navigate('/dashboard/provider')
      }

      toast.success(`Proposal ${data.status.toLowerCase()} successfully!`)
    },
  })

  if (status !== 'PROPOSAL_CREATED') {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Take Action</Button>
      </DialogTrigger>

      <DialogContent className={cn('max-w-screen-md w-full', className)} style={style}>
        <DialogHeader>
          <DialogTitle>Take action</DialogTitle>
          <DialogDescription>
            Accept or reject the contract proposal after carefully reading the terms and conditions of client.
          </DialogDescription>
        </DialogHeader>

        {match(contractProposalQuery)
          .with({ status: 'pending' }, () => (
            <div className="flex items-center justify-center h-[400px]">
              <Loading title="Fetching proposal details..." />
            </div>
          ))
          .with({ status: 'error' }, ({ error }) => (
            <div className="flex items-center justify-center h-[400px]">
              <ErrorMessage description={getErrorMessage(error)} />
            </div>
          ))
          .with({ status: 'success' }, ({ data }) => (
            <div className="p-4 border rounded-lg bg-muted-foreground/5 mt-10">
              <p className="text-right text-xs text-muted-foreground mb-4">
                Received {dayjs(data.createdAt).fromNow()}
              </p>

              <h1 className="text-xl font-bold mb-2">{data.title}</h1>
              <p className="mb-4">{data.description}</p>

              <div className="mb-6 text-center text-sm py-2 bg-muted-foreground/5">
                Original price for your service is <span className="font-bold">${servicePrice}</span> and your clients
                want to settle at <span className="font-bold">${data.settledPrice}</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  loading={processProposalMutation.isPending}
                  onClick={() => {
                    processProposalMutation.mutate({ status: 'ACCEPTED' })
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive-outline"
                  loading={processProposalMutation.isPending}
                  onClick={() => {
                    processProposalMutation.mutate({ status: 'REJECTED' })
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
          .exhaustive()}
      </DialogContent>
    </Dialog>
  )
}
