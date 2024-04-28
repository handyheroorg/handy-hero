import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import cookie from 'js-cookie'
import { useEffect, useState } from 'react'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/error-message'
import { cn, getErrorMessage } from '@/lib'
import { useAuthenticatedUser, useChatRoom } from '@/hooks'
import { Role } from '@/types'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import ChatRooms from '@/components/chat-rooms'
import ChatTopBar from './component/chat-top-bar'
import ChatList from './component/chat-list'

export function ChatRoom() {
  const { id } = useParams() as { id: string }
  const { user } = useAuthenticatedUser()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const layout = cookie.get('react-resizable-panels:layout')
  const defaultLayout = layout ? JSON.parse(layout) : [320, 480]

  const { chatRoomQuery, sendNewMessage, messages } = useChatRoom(id)

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkScreenWidth()

    window.addEventListener('resize', checkScreenWidth)

    return () => {
      window.removeEventListener('resize', checkScreenWidth)
    }
  }, [])

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
        <main className="flex h-[94vh] flex-col items-center justify-center p-4 py-10 gap-4">
          <div className="z-10 border rounded-lg max-w-screen-xl w-full h-full text-sm lg:flex">
            <ResizablePanelGroup
              direction="horizontal"
              onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
              }}
              className="h-full items-stretch"
            >
              <ResizablePanel
                defaultSize={defaultLayout[0]}
                collapsedSize={8}
                collapsible={true}
                minSize={isMobile ? 0 : 24}
                maxSize={isMobile ? 8 : 30}
                onCollapse={() => {
                  setIsCollapsed(true)
                  cookie.set('react-resizable-panels:collapsed', JSON.stringify(true))
                }}
                onExpand={() => {
                  setIsCollapsed(false)
                  cookie.set('react-resizable-panels:collapsed', JSON.stringify(false))
                }}
                className={cn(isCollapsed && 'min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out')}
              >
                <ChatRooms isCollapsed={isCollapsed} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                <div className="flex flex-col justify-between w-full h-full">
                  <ChatTopBar
                    selectedUser={secondPerson}
                    chatRoomId={data.id}
                    servicePrice={data.service.price}
                    status={data.status}
                  />

                  <ChatList messages={messages} sendMessage={sendNewMessage} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </main>
      )
    })
    .exhaustive()
}
