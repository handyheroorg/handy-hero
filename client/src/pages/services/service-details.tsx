import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { fetchService } from '@/queries'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/error-message'
import { getErrorMessage } from '@/lib'
import Container from '@/components/container'
dayjs.extend(relativeTime)

export function ServiceDetails() {
  const { id } = useParams() as { id: string }

  const serviceDetailsQuery = useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id),
  })

  return match(serviceDetailsQuery)
    .with({ status: 'pending' }, () => (
      <div className="flex items-center justify-center h-screen">
        <Loading title="Fetching service details..." />
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex items-center justify-center h-screen">
        <ErrorMessage description={getErrorMessage(error)} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <Container className="!py-10 grid grid-cols-1 md:grid-cols-5 min-h-screen">
        <div className="md:col-span-4 h-full border-r">
          <div className="flex gap-8 flex-col md:flex-row border-b p-8">
            <div className="md:size-60 max-h-96">
              <img src={data.thumbnail.publicUrl} className="w-full h-full object-cover" />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
              <p className="text-sm text-muted-foreground">Posted {dayjs(data.createdAt).fromNow()}</p>
            </div>
          </div>

          <div className="p-8">{data.description}</div>

          <div className="p-8">
            <h2 className="text-xl font-medium mb-2">Skills</h2>

            <div className="flex items-center gap-4 flex-wrap">
              {data.skills.map((skill, i) => (
                <div
                  className="px-6 py-2 rounded-full bg-muted text-muted-foreground font-medium"
                  key={`${skill}:${i}`}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-8">
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-2">Pricing</h2>

            <p>
              ${data.price} {data.priceType === 'HOURLY' ? 'hourly' : 'fixed'}
            </p>
          </div>
        </div>
      </Container>
    ))
    .exhaustive()
}
