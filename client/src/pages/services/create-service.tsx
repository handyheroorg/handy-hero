import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { BadgePlusIcon } from 'lucide-react'
import Container from '@/components/container'
import { createServiceSchema } from '@/schema'
import { handleError } from '@/lib'
import { createService } from '@/queries'
import ServiceForm from './components/service-form'

export function CreateService() {
  const navigate = useNavigate()
  const form = useForm<FieldValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      skills: [],
      priceType: 'FIXED',
    },
  })

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

      <ServiceForm
        buttonIcon={<BadgePlusIcon />}
        buttonLabel="Create Service"
        form={form}
        onSubmit={(values) => {
          createServiceMutation.mutate(createServiceSchema.parse(values))
        }}
        loading={createServiceMutation.isPending}
      />
    </Container>
  )
}
