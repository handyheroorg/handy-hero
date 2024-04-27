import { FieldValues, UseFormReturn } from 'react-hook-form'
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
import { BasicProps } from '@/types'
import { cn, VALID_IMAGE_MIME_TYPES } from '@/lib'
import FileUploader from '@/components/file-uploader'
import ArrayInput from '@/components/array-input'

type ServiceFormProps = BasicProps & {
  form: UseFormReturn<FieldValues>
  onSubmit: (values: FieldValues) => void
  loading?: boolean
  buttonLabel: string
  buttonIcon: React.ReactElement
}

export default function ServiceForm({
  className,
  style,
  form,
  onSubmit,
  loading,
  buttonLabel,
  buttonIcon,
}: ServiceFormProps) {
  const priceType = form.watch('priceType')

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values)
        })}
        className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}
        style={style}
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
                <FormLabel>Service Name</FormLabel>
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
                  <Input type="number" placeholder="Enter your service price" {...field} />
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
                  The description field is where you can highlight what makes your service unique and valuable. Use this
                  space to showcase your expertise and key features, helping potential clients understand why they
                  should choose your service.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button icon={buttonIcon} loading={loading}>
            {buttonLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
