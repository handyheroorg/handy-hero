import { Outlet, NavLink as ReactNavLink } from 'react-router-dom'
import Container from '@/components/container'
import { cn } from '@/lib'

export default function Settings() {
  return (
    <Container className="!py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <h3 className="text-xl font-medium mb-4">Billing</h3>

            <NavLink to="/settings/billing-and-payments">Billing & Payments</NavLink>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">User Settings</h3>

            <NavLink to="/settings">Contact Info</NavLink>
            <NavLink to="/settings/profile">My Profile</NavLink>
          </div>
        </div>

        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </Container>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <ReactNavLink
      to={to}
      className={({ isActive }) => cn('py-2 px-4 border-l-2 block', { 'text-primary border-l-primary': isActive })}
    >
      {children}
    </ReactNavLink>
  )
}
