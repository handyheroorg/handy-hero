import { redirect } from 'react-router-dom'
import { fetchLoggedInUser } from '@/queries'
import { Role } from '@/types'

export async function roleGuard(allowedRole: Role[]) {
  try {
    const data = await fetchLoggedInUser()

    if (!data) {
      return redirect('/auth/login')
    }

    if (!allowedRole.includes(data.role)) {
      return redirect('/')
    }

    return null
  } catch {
    return redirect('/auth/login')
  }
}
