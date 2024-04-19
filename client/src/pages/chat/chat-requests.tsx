import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import { findChatRequests } from '@/queries'
import { Skeleton } from '@/components/ui'
import ErrorMessage from '@/components/error-message'
import { cn, getErrorMessage } from '@/lib'
import Container from '@/components/container'
import ChatRequestActions from './component/chat-request-actions'
import { ChatRequestStatus } from '@/types'

export function ChatRequests() {
  const chatRequestQuery = useQuery({
    queryKey: ['chat-requests'],
    queryFn: findChatRequests,
  })

  return match(chatRequestQuery)
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
        {data.map((request) => (
          <div key={request.id} className="border rounded-lg shadow-sm p-4">
            <p className="text-xs text-muted-foreground">{dayjs(request.createdAt).fromNow()}</p>
            <h1 className="text-xl font-bold mb-4">{request.service.name}</h1>
            {request.service.description && <p className="text-sm mb-4">{request.service.description}</p>}

            {request.status === ChatRequestStatus.PENDING ? (
              <ChatRequestActions id={request.id} />
            ) : (
              <div
                className={cn(
                  'px-6 py-2 rounded-full border text-sm w-min',
                  request.status === ChatRequestStatus.ACCEPTED
                    ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                    : 'border-red-500 text-red-500 bg-red-500/10',
                )}
              >
                {request.status}
              </div>
            )}
          </div>
        ))}
      </Container>
    ))
    .exhaustive()
}
