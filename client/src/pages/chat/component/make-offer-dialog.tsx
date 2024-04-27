import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PlusIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/ui'
import { cn, handleError } from '@/lib'
import { CreateContractProposalSchema, createContractProposalSchema } from '@/schema'
import { BasicProps, ChatRoom, ChatRoomStatus } from '@/types'
import { createContractProposal } from '@/queries/contract'

type MakeOfferDialogProps = BasicProps & {
  chatRoomId: string
  servicePrice: number
  status: ChatRoomStatus
}

export default function MakeOfferDialog({ className, style, servicePrice, status, chatRoomId }: MakeOfferDialogProps) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const form = useForm<CreateContractProposalSchema>({
    resolver: zodResolver(createContractProposalSchema),
    defaultValues: {
      title: '',
      description: '',
      settledPrice: servicePrice,
    },
  })

  const createProposalMutation = useMutation({
    mutationFn: (dto: CreateContractProposalSchema) => createContractProposal(chatRoomId, dto),
    onError: handleError,
    onSuccess: () => {
      qc.setQueryData<ChatRoom | undefined>(['chat-room', chatRoomId], (prev) => {
        if (!prev) return prev

        return {
          ...prev,
          status: 'PROPOSAL_CREATED',
        }
      })
      setOpen(false)
      toast.success('Offer created successfully!')
    },
  })

  if (status !== 'IN_PROGESS') {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Make an Offer</Button>
      </DialogTrigger>

      <DialogContent className={cn('md:max-w-screen-md w-full', className)} style={style}>
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Send an offer to the service provider with your proposed terms and details. Start a negotiation or
            discussion about the service.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              createProposalMutation.mutate(values)
            })}
            className="grid grid-cols-1 gap-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the title for your proposal" {...field} />
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
                    <Textarea placeholder="Describe your proposal in brief" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide details and terms for your contract proposal here. Outline your expectations, requirements,
                    and any specific conditions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settledPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the price"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button icon={<PlusIcon />} loading={createProposalMutation.isPending}>
              Create Offer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
