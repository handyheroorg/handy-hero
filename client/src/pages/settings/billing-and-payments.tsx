import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export function BillingAndPayments() {
  return (
    <div>
      <Link to="/settings/add-payment-method">
        <Button>Add Payment Method</Button>
      </Link>
    </div>
  )
}
