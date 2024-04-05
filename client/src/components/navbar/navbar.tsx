import { Link, NavLink } from 'react-router-dom'
import { HelpCircleIcon } from 'lucide-react'
import { NotificationBell, PopoverNotificationCenter } from '@novu/notification-center'
import { cn } from '@/lib'
import { BasicProps } from '@/types'
import Container from '../container'
import { useAuthContext } from '@/hooks'

type NavbarProps = BasicProps

const NAVBAR_HEIGHT = 64

export default function Navbar({ className, style }: NavbarProps) {
  const { user } = useAuthContext()

  return (
    <nav
      className={cn('fixed top-0 left-0 w-full  bg-white/50 backdrop-blur-lg border-b', className)}
      style={{ ...style, height: NAVBAR_HEIGHT }}
    >
      <Container className="h-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Handy Hero</h1>

        <div className="flex items-center gap-x-6">
          <NavLink to="/help" className={({ isActive }) => (isActive ? 'text-black' : 'text-muted-foreground')}>
            <HelpCircleIcon className="size-5" />
          </NavLink>

          <PopoverNotificationCenter colorScheme="light">
            {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
          </PopoverNotificationCenter>

          <Link to="/settings">
            {user?.avatar ? (
              <img className="w-8 h-8 object-cover" src={user.avatar} />
            ) : (
              <div className="font-medium flex items-center justify-center w-8 h-8 border rounded-full">
                {user?.fullName[0]}
              </div>
            )}
          </Link>
        </div>
      </Container>
    </nav>
  )
}

Navbar.NAVBAR_HEIGHT = NAVBAR_HEIGHT
