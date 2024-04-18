import { Outlet, NavLink as ReactNavLink, useLocation } from 'react-router-dom'
import Container from '@/components/container'
import { cn } from '@/lib'
import { useAuthenticatedUser } from '@/hooks'
import { Role } from '@/types'

export default function Settings() {
  const { user } = useAuthenticatedUser()

  return (
    <Container className="grid grid-cols-1 md:grid-cols-4 gap-4 relative h-[94vh] overflow-hidden !py-10">
      <div className="sticky">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <h3 className="text-xl font-medium mb-4">Billing</h3>

          <NavLink to="/settings/billing-and-payments">Billing & Payments</NavLink>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-4">User Settings</h3>

          <NavLink to="/settings">Contact Info</NavLink>
          {user.role === Role.SERVICE_PROVIDER && <NavLink to="/settings/profile">My Profile</NavLink>}
        </div>
      </div>

      <div className="md:col-span-3 overflow-y-auto hide-scrollbar">
        <Outlet />
      </div>
    </Container>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const pathname = useLocation().pathname
  const isActive = to === pathname

  return (
    <ReactNavLink to={to} className={cn('py-2 px-4 border-l-2 block', { 'text-primary border-l-primary': isActive })}>
      {children}
    </ReactNavLink>
  )
}
