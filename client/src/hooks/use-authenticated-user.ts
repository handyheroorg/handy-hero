import invariant from 'tiny-invariant'
import { useAuthContext } from './use-auth'

export function useAuthenticatedUser() {
  const { user } = useAuthContext()
  invariant(user, 'useAuthenticatedUser hook should be used inside authenticated context only')

  return { user }
}
