import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SendIcon } from 'lucide-react'
import { BasicProps } from '@/types'
import { cn } from '@/lib'
import { Button, Form, FormField, FormMessage } from '@/components/ui'

type FormValues = { message: string }

type NewMessageFormProps = BasicProps & {
  onSubmit: (data: FormValues) => void
}

export default function NewMessageForm({ className, style, onSubmit }: NewMessageFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({ message: z.string().min(1, 'Please enter your message!') })),
    defaultValues: { message: '' },
  })

  return (
    <Form {...form}>
      <form
        className={cn('h-16 w-full border-t px-4 flex items-center justify-between gap-x-2', className)}
        style={style}
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values)
          form.reset({ message: '' })
        })}
      >
        <FormField
          name="message"
          control={form.control}
          render={({ field }) => (
            <>
              <input className="focus-visible:outline-none flex-1" placeholder="Type your message" {...field} />
              <FormMessage />
            </>
          )}
        />

        <Button icon={<SendIcon />} />
      </form>
    </Form>
  )
}
