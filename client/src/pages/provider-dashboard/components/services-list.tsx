import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { Link } from 'react-router-dom'
import { EyeIcon, PencilIcon } from 'lucide-react'
import { BasicProps, PriceType } from '@/types'
import { fetchUserServices } from '@/queries'
import { Button, Skeleton } from '@/components/ui'
import ErrorMessage from '@/components/error-message'
import { cn, getErrorMessage } from '@/lib'
import DeleteService from './delete-service'

type ServicesListProps = BasicProps

export default function ServicesList({ className, style }: ServicesListProps) {
  const serviceListQuery = useQuery({
    queryKey: ['services-list'],
    queryFn: fetchUserServices,
  })

  return match(serviceListQuery)
    .with({ status: 'pending' }, () => (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-40 rounded-lg" />
        ))}
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="h-screen flex items-center justify-center">
        <ErrorMessage description={getErrorMessage(error)} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <div className={className} style={style}>
        <h1 className="text-lg font-medium mb-4">Your services</h1>

        <div className="grid grid-cols-1 gap-4">
          {data.map((service) => (
            <div key={service.id} className="border rounded-lg p-6 flex gap-8 flex-col md:flex-row">
              <div className="size-44 rounded-full overflow-hidden">
                <img src={service.thumbnail.publicUrl} alt={service.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{service.name}</h1>
                <p className="text-lg mb-2">
                  Price <span className="font-medium"> ${service.price}</span>
                </p>

                <PriceTypeTag priceType={service.priceType} />

                <div className="flex items-center gap-4">
                  <Link to={`/services/${service.id}`}>
                    <Button icon={<EyeIcon />}>View Details</Button>
                  </Link>

                  <Link to={`/services/${service.id}/edit`}>
                    <Button icon={<PencilIcon />} variant="secondary">
                      Edit
                    </Button>
                  </Link>

                  <DeleteService id={service.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))
    .exhaustive()
}

function PriceTypeTag({ priceType }: { priceType: PriceType }) {
  const classes = {
    HOURLY: 'border-green-500 bg-green-50 text-green-500',
    FIXED: 'border-yellow-500 bg-yellow-50 text-yellow-500',
  }

  return <div className={cn('px-6 py-2 rounded-full text-sm w-max border mb-4', classes[priceType])}>{priceType}</div>
}
