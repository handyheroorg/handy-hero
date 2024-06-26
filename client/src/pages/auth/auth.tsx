import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { AuthIllustration } from '@/components/icons'
import { useAuthContext } from '@/hooks'
import Loading from '@/components/loading'

export default function AuthLayout() {
  const { isAuthInProgress, user } = useAuthContext()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  if (isAuthInProgress) {
    return (
      <div className="flex items-center justify-center h-screen z-50">
        <Loading title="Authentication in progress..." />
      </div>
    )
  }

  if (user) {
    return <Navigate to={redirectTo} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:flex bg-gradient-to-b from-emerald-900 to-emerald-600 px-8 items-center justify-center">
        <div className="w-full mx-auto max-w-screen-sm">
          <h1 className="text-4xl font-bold text-white mb-2">Handy Hero</h1>
          <p className="text-white/80">Unleash Potential, Forge Connections: Your Community Workforce Hub</p>

          <AuthIllustration className="w-full h-[500px]" />
        </div>
      </div>
      <div className="px-8 flex items-center justify-center">
        <div className="w-full mx-auto max-w-screen-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
