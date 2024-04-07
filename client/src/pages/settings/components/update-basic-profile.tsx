import { RotateCwIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input, Textarea } from '@/components/ui'
import { cn, handleError } from '@/lib'
import { BasicProps, Profile } from '@/types'
import { updateProfileSchema, UpdateProfileSchema } from '@/schema'
import { updateProfile } from '@/queries'
import ArrayInput from './array-input'

type UpdateBasicProfileProps = BasicProps & {
  profile: Profile
  onCancel: () => void
}

export default function UpdateBasicProfile({ className, style, profile, onCancel }: UpdateBasicProfileProps) {
  const qc = useQueryClient()

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      occupation: profile.occupation ?? '',
      about: profile.about ?? '',
      fullAddress: profile.fullAddress ?? '',
      languages: profile.languages,
      skills: profile.skills,
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onError: handleError,
    onSuccess: (updatedProfile) => {
      qc.setQueryData(['profile'], updatedProfile)
      toast.success('Profile updated successfully!')
      onCancel()
    },
  })

  return (
    <Form {...form}>
      <form
        className={cn('px-8 py-6 rounded-xl border grid grid-cols-1 gap-4', className)}
        style={style}
        onSubmit={form.handleSubmit((values) => {
          updateProfileMutation.mutate(values)
        })}
      >
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input placeholder="Occupation" disabled={updateProfileMutation.isPending} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea placeholder="About" rows={5} disabled={updateProfileMutation.isPending} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Full Address" rows={4} disabled={updateProfileMutation.isPending} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languages"
          render={() => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <FormControl>
                <ArrayInput addButtonLabel="Add Language" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <ArrayInput addButtonLabel="Add Skill" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button icon={<RotateCwIcon />} loading={updateProfileMutation.isPending}>
            Update
          </Button>
          <Button variant="ghost" type="button" onClick={onCancel} disabled={updateProfileMutation.isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
