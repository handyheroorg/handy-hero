import { isAxiosError } from 'axios'
import { toast } from 'sonner'

export function getErrorMessage(error: unknown) {
  return isAxiosError(error) ? error?.response?.data?.message : 'Something went wrong, please try again!'
}

export function handleError(error: unknown) {
  const message = getErrorMessage(error)
  toast.error(message)
}
