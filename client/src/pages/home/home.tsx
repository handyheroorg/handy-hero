import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks'
import { Role } from '@/types'

export default function Home() {
  const { user } = useAuthContext()

  if (!user?.isOnboarded) {
    return <Navigate to="/welcome" />
  }

  if (user.role === Role.SERVICE_PROVIDER) {
    return <Navigate to="/provider/dashboard" />
  }

  return <div>Homepage</div>
}
