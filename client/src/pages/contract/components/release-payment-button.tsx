import { RocketIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui'
import { BasicProps, Contract, Role } from '@/types'
import { releasePayment } from '@/queries'
import { handleError } from '@/lib'
import { useAuthenticatedUser } from '@/hooks'

type ReleasePaymentButtonProps = BasicProps & {
  contractId: string
  status: Contract['status']
}

export default function ReleasePaymentButton({ contractId, status, ...buttonProps }: ReleasePaymentButtonProps) {
  const { user } = useAuthenticatedUser()
  const releasePaymentMutation = useMutation({
    mutationFn: releasePayment,
    onError: handleError,
    onSuccess: () => {
      toast.success('Payment release successfully!')
    },
  })

  /** Only a client can release a payment */
  if (user.role !== Role.CLIENT) {
    return null
  }

  if (status === 'COMPLETED') {
    return <div className="text-emerald-500 text-lg font-bold">Payment Completed</div>
  }

  return (
    <Button
      icon={<RocketIcon />}
      {...buttonProps}
      loading={releasePaymentMutation.isPending}
      onClick={() => {
        releasePaymentMutation.mutate(contractId)
      }}
    >
      Release Payment
    </Button>
  )
}
