import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/ui'
import { BasicProps } from '@/types'
import { cn, handleError } from '@/lib'
import { Education, educationSchema } from '@/schema'
import { updateProfile } from '@/queries'

type AddEducationDialogProps = BasicProps & {
  education: Education[]
}

export default function AddEducationDialog({ className, style, education }: AddEducationDialogProps) {
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const form = useForm<Education>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      school: '',
      degree: '',
      description: '',
      fieldOfStudy: '',
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onError: handleError,
    onSuccess: (updatedProfile) => {
      qc.setQueryData(['profile'], updatedProfile)
      toast.success('Profile updated successfully!')
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<PlusIcon />} variant="ghost" className="text-primary" />
      </DialogTrigger>

      <DialogContent className={cn('w-full max-w-screen-md', className)} style={style}>
        <DialogHeader>
          <DialogTitle>Add Education Details</DialogTitle>
          <DialogDescription>
            Enhance your profile by sharing your educational qualifications. Showcase your expertise to potential
            clients by entering your academic background below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={form.handleSubmit((newEducation) => {
              updateProfileMutation.mutate({ education: [...education, newEducation] })
            })}
          >
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School/University</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your school/university name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree/Course</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your degree/course name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fieldOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of study</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter field of study" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-4 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker placeholder="Select start date" date={field.value} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker placeholder="Select end date" date={field.value} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description or summary of your educational experience"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-4">
              <Button icon={<PlusIcon />} loading={updateProfileMutation.isPending}>
                Add
              </Button>

              <Button
                disabled={updateProfileMutation.isPending}
                variant="ghost"
                type="button"
                onClick={() => {
                  form.reset({})
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
