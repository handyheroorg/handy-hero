import { SquarePaymentsForm, CreditCardInput } from 'react-square-web-payments-sdk'
import { env } from '@/lib'

export function AddPaymentMethod() {
  return (
    <div className="max-w-screen-sm">
      <SquarePaymentsForm
        applicationId={env.VITE_SQUARE_APP_ID}
        locationId={env.VITE_SQUARE_LOCATION_ID}
        cardTokenizeResponseReceived={(response) => {
          console.log(response)
        }}
      >
        <CreditCardInput text="Add Card" />
      </SquarePaymentsForm>
    </div>
  )
}
