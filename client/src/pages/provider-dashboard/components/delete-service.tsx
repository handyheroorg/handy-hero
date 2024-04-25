import { TrashIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
import { deleteService } from '@/queries'
import { handleError } from '@/lib'
import { Service } from '@/types'

type DeleteServiceProps = {
  id: string
}

export default function DeleteService({ id }: DeleteServiceProps) {
  const qc = useQueryClient()
  const deleteServiceMutation = useMutation({
    mutationFn: deleteService,
    onError: handleError,
    onSuccess: (deletedService) => {
      qc.setQueryData<Service[]>(['services-list'], (prev) => {
        if (!prev) return []

        return prev.filter((s) => s.id !== deletedService.id)
      })

      toast.success('Service deleted successfully!')
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button icon={<TrashIcon />} variant="destructive" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Service Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this service? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteServiceMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="bg-destructive hover:bg-destructive/80"
              onClick={(e) => {
                e.preventDefault()
                deleteServiceMutation.mutate(id)
              }}
              loading={deleteServiceMutation.isPending}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
