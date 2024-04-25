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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { BasicProps } from '@/types'
import { cn, formatEnum, handleError } from '@/lib'
import { EmploymentType, Experience, experienceSchema } from '@/schema'
import { updateProfile } from '@/queries'

type AddExperienceDialogProps = BasicProps & {
  experience: Experience[]
}

export default function AddExperienceDialog({ className, style, experience }: AddExperienceDialogProps) {
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const form = useForm<Experience>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      company: '',
      industry: '',
      currentlyWorkingHere: false,
      description: '',
    },
  })

  const currentlyWorkingHere = form.watch('currentlyWorkingHere')

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

      <DialogContent className={cn('w-full max-w-screen-lg', className)} style={style}>
        <DialogHeader>
          <DialogTitle>Add Your Experience</DialogTitle>
          <DialogDescription>
            Share your professional experience to highlight your skills and expertise. Enhance your profile by adding
            details about your previous roles, projects, and achievements below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit((newExperience) => {
              updateProfileMutation.mutate({ experience: [...experience, newExperience] })
            })}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your job title" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter industry" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your employment type" />
                      </SelectTrigger>

                      <SelectContent>
                        {Object.keys(EmploymentType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {formatEnum(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="currentlyWorkingHere"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Do you currently work here?</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Button
                        type="button"
                        variant={field.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          field.onChange(true)
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={!field.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          field.onChange(false)
                        }}
                      >
                        No
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {!currentlyWorkingHere && (
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
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a brief description or summary of your experience" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-4 md:col-span-2">
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
