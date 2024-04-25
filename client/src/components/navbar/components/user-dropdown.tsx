import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { useAuthContext, useAuthenticatedUser } from '@/hooks'
import { cn } from '@/lib'
import { BasicProps, Role } from '@/types'

type UserDropdownProps = BasicProps

export default function UserDropdown({ className, style }: UserDropdownProps) {
  const { user } = useAuthenticatedUser()
  const { logout } = useAuthContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {user?.avatar ? (
          <img className="w-8 h-8 object-cover rounded-full" src={user.avatar.publicUrl} />
        ) : (
          <div className="font-medium flex items-center justify-center w-8 h-8 border rounded-full">
            {user?.fullName[0]}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-56', className)} style={style}>
        <DropdownMenuLabel>
          <p>{user.fullName}</p>
          <p className="text-sm text-muted-foreground font-normal">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          {user.role === Role.SERVICE_PROVIDER && (
            <DropdownMenuItem asChild>
              <Link to="/settings/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
