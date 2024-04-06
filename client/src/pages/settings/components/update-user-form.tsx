import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { RotateCwIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@/components/ui'
import { cn, handleError, USER_QUERY_KEY } from '@/lib'
import { UpdateUserSchema, updateUserSchema } from '@/schema'
import { BasicProps } from '@/types'
import { useAuthenticatedUser } from '@/hooks'
import { updateUser } from '@/queries'

type UpdateUserFormProps = BasicProps & {
  onCancel: () => void
}

export default function UpdateUserForm({ className, style, onCancel }: UpdateUserFormProps) {
  const { user } = useAuthenticatedUser()
  const qc = useQueryClient()

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      country: user.country,
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onError: handleError,
    onSuccess(updatedUser) {
      qc.setQueryData(USER_QUERY_KEY, updatedUser)
      toast.success('Profile Updated successfully!')
      onCancel()
    },
  })

  return (
    <Form {...form}>
      <form
        className={cn('px-8 py-6 rounded-3xl border relative grid grid-cols-1 gap-4', className)}
        style={style}
        onSubmit={form.handleSubmit((values) => {
          updateUserMutation.mutate(values)
        })}
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" disabled={updateUserMutation.isPending} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="Mobile Number" disabled={updateUserMutation.isPending} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" disabled={updateUserMutation.isPending} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button icon={<RotateCwIcon />} loading={updateUserMutation.isPending}>
            Update
          </Button>
          <Button variant="ghost" type="button" onClick={onCancel} disabled={updateUserMutation.isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
