import { Link, NavLink } from 'react-router-dom'
import { BellIcon, HelpCircleIcon } from 'lucide-react'
import { cn } from '@/lib'
import { BasicProps } from '@/types'
import Container from '../container'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAuthContext } from '@/hooks'

type NavbarProps = BasicProps

export default function Navbar({ className, style }: NavbarProps) {
  const { user } = useAuthContext()

  return (
    <nav
      className={cn('fixed top-0 left-0 w-full h-14 bg-white/50 backdrop-blur-lg border-b', className)}
      style={style}
    >
      <Container className="h-full flex items-center justify-between">
        <h1 className="text-lg font-bold">Handy Hero</h1>

        <ul className="flex items-center gap-x-6">
          <li>
            <NavLink to="/help" className={({ isActive }) => (isActive ? 'text-black' : 'text-muted-foreground')}>
              <HelpCircleIcon className="size-5" />
            </NavLink>
          </li>
          <li>
            <BellIcon className="size-5 text-muted-foreground" />
          </li>
          <li>
            <Link to="/settings">
              <Avatar>
                <Avatar>
                  <AvatarImage src={user?.avatar ?? '/avatar.png'} alt="@shadcn" />
                  <AvatarFallback>{user?.fullName}</AvatarFallback>
                </Avatar>
              </Avatar>
            </Link>
          </li>
        </ul>
      </Container>
    </nav>
  )
}
