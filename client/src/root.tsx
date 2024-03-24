import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from './hooks'
import Loading from './components/loading'

export default function Root() {
  const { isAuthInProgress, user } = useAuthContext()

  if (isAuthInProgress) {
    return (
      <div className="flex items-center justify-center h-screen z-50">
        <Loading title="Authentication in progress..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" />
  }

  return <Outlet />
}
