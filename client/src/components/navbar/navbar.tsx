import { Link, NavLink } from 'react-router-dom'
import { HelpCircleIcon } from 'lucide-react'
import { NotificationBell, PopoverNotificationCenter } from '@novu/notification-center'
import { cn } from '@/lib'
import { BasicProps } from '@/types'
import Container from '../container'
import UserDropdown from './components/user-dropdown'

type NavbarProps = BasicProps

const NAVBAR_HEIGHT = 64

export default function Navbar({ className, style }: NavbarProps) {
  return (
    <nav
      className={cn('fixed top-0 left-0 w-full  bg-white/50 backdrop-blur-lg border-b z-50', className)}
      style={{ ...style, height: NAVBAR_HEIGHT }}
    >
      <Container className="h-full flex items-center justify-between">
        <Link className="text-2xl font-bold" to="/">
          Handy Hero
        </Link>

        <div className="flex items-center gap-x-6">
          <NavLink to="/help" className={({ isActive }) => (isActive ? 'text-black' : 'text-muted-foreground')}>
            <HelpCircleIcon className="size-5" />
          </NavLink>

          <PopoverNotificationCenter colorScheme="light">
            {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
          </PopoverNotificationCenter>

          <UserDropdown />
        </div>
      </Container>
    </nav>
  )
}

Navbar.NAVBAR_HEIGHT = NAVBAR_HEIGHT
