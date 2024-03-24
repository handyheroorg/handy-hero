import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import constate from 'constate'
import { toast } from 'sonner'
import { AUTH_TOKEN_KEY, handleError, LOGGED_IN_QUERY_KEY, USER_QUERY_KEY } from '@/lib'
import { fetchLoggedInUser, signup } from '@/queries'

function setStoredAccessToken(accessToken: string) {
  return localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
}

function useAuth() {
  const qc = useQueryClient()

  const { isLoading: isAuthInProgress, data: user } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchLoggedInUser,
  })

  const signupMutation = useMutation({
    mutationFn: signup,
    onError: handleError,
    onSuccess(data) {
      /** Saving token */
      setStoredAccessToken(data.access_token)

      /** Updating the data in queryClient */
      qc.setQueryData(LOGGED_IN_QUERY_KEY, data)

      toast.success('Your account is created successfully!')
    },
  })

  return {
    isAuthInProgress,
    user,
    signupMutation,
  }
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
