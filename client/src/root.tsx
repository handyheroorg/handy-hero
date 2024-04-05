import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { NovuProvider } from '@novu/notification-center'
import { useAuthContext } from './hooks'
import Loading from './components/loading'
import Navbar from './components/navbar'
import { env } from './lib'

export default function Root() {
  const { isAuthInProgress, user } = useAuthContext()
  const location = useLocation()

  if (isAuthInProgress) {
    return (
      <div className="flex items-center justify-center h-screen z-50">
        <Loading title="Authentication in progress..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={{ pathname: '/auth/login', search: `?redirectTo=${location.pathname}` }} />
  }

  return (
    <NovuProvider applicationIdentifier={env.VITE_NOVU_APP_ID} subscriberId={user.id}>
      <Navbar />
      <div className="w-full" style={{ height: Navbar.NAVBAR_HEIGHT }} />
      <Outlet />
    </NovuProvider>
  )
}
