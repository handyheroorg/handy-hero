import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import { fetchContractProposals } from '@/queries'
import Container from '@/components/container'
import { Skeleton } from '@/components/ui'
import ErrorMessage from '@/components/error-message'
import { cn, getErrorMessage } from '@/lib'
import ProcessContractProposal from '../chat/component/process-contract-proposal'

export function ContractProposals() {
  const contractProposalsQuery = useQuery({
    queryKey: ['contract-proposals'],
    queryFn: fetchContractProposals,
  })

  return match(contractProposalsQuery)
    .with({ status: 'pending' }, () => (
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg flex-1" />
        ))}
      </Container>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex items-center justify-center">
        <ErrorMessage description={getErrorMessage(error)} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        {data.map((proposal) => (
          <div key={proposal.id} className="border rounded-lg shadow-sm p-4">
            <p className="text-xs text-muted-foreground">Sent {dayjs(proposal.createdAt).fromNow()}</p>
            <h1 className="text-xl font-bold mb-4">{proposal.title}</h1>
            {proposal.description && <p className="text-sm mb-4">{proposal.description}</p>}

            {proposal.status === 'PENDING' ? (
              <ProcessContractProposal
                chatRoomId={proposal.chatRoomId}
                status={proposal.chatRoom.status}
                servicePrice={proposal.chatRoom.service.price}
              />
            ) : (
              <div
                className={cn(
                  'px-6 py-2 rounded-full border text-xs w-min',
                  proposal.status === 'ACCEPTED'
                    ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                    : 'border-red-500 text-red-500 bg-red-500/10',
                )}
              >
                {proposal.status}
              </div>
            )}
          </div>
        ))}
      </Container>
    ))
    .exhaustive()
}
