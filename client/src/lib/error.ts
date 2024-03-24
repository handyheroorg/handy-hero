import { isAxiosError } from 'axios'
import { toast } from 'sonner'

export function handleError(error: unknown) {
  const message = isAxiosError(error) ? error?.response?.data?.message : 'Something went wrong, please try again!'
  toast.error(message)
}
