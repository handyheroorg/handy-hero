import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { BadgePlusIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Container from '@/components/container'
import { CreateServiceSchema, createServiceSchema } from '@/schema'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
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
import FileUploader from '@/components/file-uploader'
import { handleError, VALID_IMAGE_MIME_TYPES } from '@/lib'
import ArrayInput from '@/components/array-input'
import { createService } from '@/queries'

export function CreateService() {
  const navigate = useNavigate()
  const form = useForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      skills: [],
      priceType: 'FIXED',
    },
  })

  const priceType = form.watch('priceType')

  const createServiceMutation = useMutation({
    mutationFn: createService,
    onError: handleError,
    onSuccess: () => {
      form.reset()
      toast.success('Service created successfully!')
      navigate('/provider/dashboard')
    },
  })

  return (
    <Container className="!py-4">
      <h1 className="text-2xl font-bold">Add Your Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Expand your reach and showcase your expertise by adding your services to our platform. Create detailed listings
        that highlight your offerings and attract potential clients.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            createServiceMutation.mutate(values)
          })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploader
                      onChange={(file) => field.onChange(file.id)}
                      allowedMimeTypes={VALID_IMAGE_MIME_TYPES}
                    />
                  </FormControl>
                  <p className="text-lg font-medium mt-2 text-center">Service Thumbnail</p>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the name of your service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (in $)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter the name of your service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Type</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="FIXED">Fixed</SelectItem>
                        <SelectItem value="HOURLY">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {priceType === 'HOURLY' && (
              <FormField
                control={form.control}
                name="maxHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Hours</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter max hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <ArrayInput addButtonLabel="Add Skill" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Enter a brief description about your service" {...field} />
                  </FormControl>
                  <FormDescription>
                    The description field is where you can highlight what makes your service unique and valuable. Use
                    this space to showcase your expertise and key features, helping potential clients understand why
                    they should choose your service.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              icon={<BadgePlusIcon />}
              disabled={!form.formState.isValid}
              loading={createServiceMutation.isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  )
}
