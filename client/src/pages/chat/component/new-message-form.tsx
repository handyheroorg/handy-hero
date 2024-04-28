import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SendIcon, ThumbsUpIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'
import { BasicProps } from '@/types'
import { cn } from '@/lib'
import { Button, Form, FormField, FormMessage, Input } from '@/components/ui'

type FormValues = { message: string }

type NewMessageFormProps = BasicProps & {
  onSubmit: (data: FormValues) => void
}

export default function NewMessageForm({ className, style, onSubmit }: NewMessageFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({ message: z.string().min(1, 'Please enter your message!') })),
    defaultValues: { message: '' },
  })

  const message = form.watch('message')

  return (
    <div className={cn('px-4 py-2', className)} style={style}>
      <AnimatePresence initial={false}>
        <Form {...form}>
          <motion.form
            className="w-full flex gap-x-2 items-center"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: 'spring',
                bounce: 0.15,
              },
            }}
            onSubmit={form.handleSubmit((values) => {
              onSubmit(values)
              form.reset({ message: '' })
              inputRef?.current?.focus()
            })}
          >
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    autoComplete="off"
                    ref={inputRef}
                    placeholder="Aa"
                    className="w-full border rounded-full flex items-center resize-none overflow-hidden bg-background"
                  />
                  <FormMessage />
                </>
              )}
            />

            {message.trim() ? (
              <Button type="submit" variant="ghost" icon={<SendIcon />} />
            ) : (
              <Button
                type="button"
                variant="ghost"
                icon={<ThumbsUpIcon />}
                onClick={() => {
                  onSubmit({ message: '👍' })
                }}
              />
            )}
          </motion.form>
        </Form>
      </AnimatePresence>
    </div>
  )
}
