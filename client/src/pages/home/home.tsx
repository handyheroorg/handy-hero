import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks'

export default function Home() {
  const { user } = useAuthContext()

  if (!user?.isOnboarded) {
    return <Navigate to="/welcome" />
  }

  return <div>Homepage</div>
}
