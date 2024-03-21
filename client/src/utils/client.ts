import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { env } from './env'
import { AUTH_TOKEN_KEY } from './constants'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
})

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
})

/**
 * Appending auth token to each outgoing request
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (!config.headers.Authorization && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
