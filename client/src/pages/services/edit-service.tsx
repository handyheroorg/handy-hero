import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { ArrowLeftIcon, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { fetchService, updateService } from '@/queries'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/error-message'
import { getErrorMessage, handleError } from '@/lib'
import { UpdateServiceSchema, updateServiceSchema } from '@/schema'
import Container from '@/components/container'
import ServiceForm from './components/service-form'

export function EditService() {
  const { id } = useParams() as { id: string }

  const serviceQuery = useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id),
  })

  const form = useForm<FieldValues>({
    resolver: zodResolver(updateServiceSchema),
  })

  const updateServiceMutation = useMutation({
    mutationFn: (dto: UpdateServiceSchema) => updateService(id, dto),
    onError: handleError,
    onSuccess: () => {
      toast.success('Service Updated Successfully!')
    },
  })

  useEffect(() => {
    if (serviceQuery.status === 'success') {
      form.reset({ ...serviceQuery.data, thumbnail: serviceQuery.data.thumbnail.id })
    }
  }, [form, serviceQuery.data, serviceQuery.status])

  return match(serviceQuery)
    .with({ status: 'pending' }, () => (
      <div className="flex items-center justify-between h-screen">
        <Loading title="Fetching service details..." />
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex items-center justify-center h-screen">
        <ErrorMessage description={getErrorMessage(error)} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <Container className="!py-4">
        <Link to="/provider/dashboard" className="mb-8 flex items-center gap-x-4">
          <ArrowLeftIcon className="text-muted-foreground" />

          <h1 className="text-2xl font-bold">Edit {data.name}</h1>
        </Link>

        <ServiceForm
          form={form}
          onSubmit={(values) => {
            updateServiceMutation.mutate(updateServiceSchema.parse(values))
          }}
          buttonIcon={<RefreshCcw />}
          buttonLabel="Update"
          loading={updateServiceMutation.isPending}
        />
      </Container>
    ))
    .exhaustive()
}
