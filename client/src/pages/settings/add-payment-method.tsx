import { SquarePaymentsForm, CreditCardInput } from 'react-square-web-payments-sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Navigate, useNavigate } from 'react-router-dom'
import { env, handleError, USER_QUERY_KEY } from '@/lib'
import { createCard } from '@/queries'
import { createCardSchema } from '@/schema'
import Loading from '@/components/loading'
import { User } from '@/types'
import { useAuthenticatedUser } from '@/hooks'

export function AddPaymentMethod() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuthenticatedUser()

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onError: handleError,
    onSuccess: () => {
      qc.setQueryData<User | undefined>(USER_QUERY_KEY, (prev) => {
        if (!prev) return

        return {
          ...prev,
          isPaymentVerified: true,
        }
      })

      navigate('/settings/billing-and-payments')

      toast.success('Your card is added successfully!')
    },
  })

  if (user.isPaymentVerified) {
    return <Navigate to="/settings/billing-and-payments" />
  }

  return (
    <div className="max-w-screen-sm">
      {createCardMutation.isPending && <Loading className="mb-4" title="Saving your card" />}

      <SquarePaymentsForm
        applicationId={env.VITE_SQUARE_APP_ID}
        locationId={env.VITE_SQUARE_LOCATION_ID}
        cardTokenizeResponseReceived={(response) => {
          const result = createCardSchema.safeParse({
            token: response.token,
            brand: response.details?.card?.brand,
            expMonth: response.details?.card?.expMonth,
            expYear: response.details?.card?.expYear,
            last4: response.details?.card?.last4,
          })

          if (!result.success) {
            return toast.error('Invalid card details found, please try again!')
          }

          createCardMutation.mutate(result.data)
        }}
      >
        <CreditCardInput text="Add Card" />
      </SquarePaymentsForm>
    </div>
  )
}
