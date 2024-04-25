import { CircleXIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/components/ui'
import { BasicProps } from '@/types'
import { endContract } from '@/queries'
import { handleError } from '@/lib'

type EndContractButtonProps = BasicProps & {
  contractId: string
}

export default function EndContractButton({ className, style, contractId }: EndContractButtonProps) {
  const navigate = useNavigate()
  const endContractMutation = useMutation({
    mutationFn: endContract,
    onError: handleError,
    onSuccess: () => {
      navigate('/')
      toast.success('Contract ended successfully!')
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button icon={<CircleXIcon />} variant="destructive">
          End Contract
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className={className} style={style}>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm End Contract</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end this contract? Make sure you have received all your pending money!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={endContractMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="bg-destructive hover:bg-destructive/80"
              onClick={(e) => {
                e.preventDefault()
                endContractMutation.mutate(contractId)
              }}
              loading={endContractMutation.isPending}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
