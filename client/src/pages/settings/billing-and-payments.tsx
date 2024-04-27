import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { useAuthenticatedUser } from '@/hooks'
import Verified from '@/components/verified'

export function BillingAndPayments() {
  const { user } = useAuthenticatedUser()

  return (
    <div>
      {user.isPaymentVerified ? (
        <Verified title="Payment" />
      ) : (
        <Link to="/settings/add-payment-method">
          <Button>Add Payment Method</Button>
        </Link>
      )}
    </div>
  )
}
