import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { SendIcon } from 'lucide-react'
import { fetchChatRoom } from '@/queries'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/error-message'
import { getErrorMessage } from '@/lib'
import { useAuthenticatedUser } from '@/hooks'
import { Role } from '@/types'
import { Button } from '@/components/ui'
import MakeOfferDialog from './component/make-offer-dialog'
import ProcessContractProposal from './component/process-contract-proposal'

export function ChatRoom() {
  const { id } = useParams() as { id: string }
  const { user } = useAuthenticatedUser()

  const chatRoomQuery = useQuery({
    queryKey: ['chat-room', id],
    queryFn: () => fetchChatRoom(id),
  })

  return match(chatRoomQuery)
    .with({ status: 'pending' }, () => (
      <div className="flex items-center justify-center h-screen">
        <Loading title="Fetching chat room details..." />
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex items-center justify-center h-screen">
        <ErrorMessage description={getErrorMessage(error)} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => {
      const secondPerson = user.role === Role.CLIENT ? data.provider : data.client

      return (
        <div className="flex items-center justify-center h-[93vh]">
          <div className="grid grid-cols-1 md:grid-cols-5 h-[90%] p-0 overflow-hidden w-full max-w-screen-2xl border">
            <div className="hidden md:block border-r">ChatRooms</div>
            <div className="md:col-span-4 md:border-r flex flex-col">
              <div className="px-4 w-full flex items-center justify-between border-b h-16">
                <div>
                  <div className="flex gap-2 items-center">
                    <h1 className="text-xl font-medium">{secondPerson.fullName}</h1>
                    <div className="size-2 rounded-full bg-emerald-500" />
                  </div>

                  <p className="text-xs text-muted-foreground">{data.service.name}</p>
                </div>

                {user.role === Role.CLIENT ? (
                  <MakeOfferDialog chatRoomId={data.id} servicePrice={data.service.price} status={data.status} />
                ) : (
                  <ProcessContractProposal
                    chatRoomId={data.id}
                    status={data.status}
                    servicePrice={data.service.price}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 flex-1">
                <div className="md:col-span-3 flex flex-col">
                  <div className="flex-1">Chat messages</div>
                  <form className="h-16 w-full border-t px-4 flex items-center justify-between gap-x-2">
                    <input className="focus-visible:outline-none flex-1" placeholder="Type your message" />
                    <Button icon={<SendIcon />} />
                  </form>
                </div>
                <div className="hidden md:block border-l h-full px-4 py-2">
                  <h1 className="text-lg font-medium">{data.service.name}</h1>
                  <p className="text-sm">
                    ${data.service.price} {data.service.priceType}
                  </p>

                  {!!data.service.description && (
                    <p className="text-xs text-muted-foreground my-2">{data.service.description}</p>
                  )}

                  {data.service.skills.map((skill, i) => (
                    <div
                      className="w-max px-6 py-2 rounded-full bg-muted-foreground/5 text-muted-foreground mt-4"
                      key={`${skill}-${i}`}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
    .exhaustive()
}
