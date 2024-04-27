import { useMutation, useQuery } from '@tanstack/react-query'
import constate from 'constate'
import { toast } from 'sonner'
import { AUTH_TOKEN_KEY, handleError, USER_QUERY_KEY } from '@/lib'
import { fetchLoggedInUser, login, signup } from '@/queries'

function setStoredAccessToken(accessToken: string) {
  return localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
}

function removeStoredAccessToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

function useAuth() {
  const {
    isLoading: isAuthInProgress,
    data: user,
    refetch,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchLoggedInUser,
    retry: false,
  })

  const signupMutation = useMutation({
    mutationFn: signup,
    onError: handleError,
    onSuccess(data) {
      /** Saving token */
      setStoredAccessToken(data.access_token)

      /** Refetching user details */
      refetch()

      toast.success('Your account is created successfully!')
    },
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onError: handleError,
    onSuccess(data) {
      /** Saving user */
      setStoredAccessToken(data.access_token)

      /** Refetching user details */
      refetch()

      toast.success('Logged in successfully!')
    },
  })

  function logout() {
    /** Removing user's access token */
    removeStoredAccessToken()

    window.location.href = '/auth/login'

    toast.success('Logout success!')
  }

  return {
    isAuthInProgress,
    user,
    signupMutation,
    loginMutation,
    logout,
  }
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
