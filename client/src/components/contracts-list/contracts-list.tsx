import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { cn, getErrorMessage } from '@/lib'
import { BasicProps } from '@/types'
import { fetchContracts } from '@/queries'
import { Skeleton } from '../ui'
import ErrorMessage from '../error-message'
import EmptyMessage from '../empty-message'

type ContractsListProps = BasicProps

export default function ContractsList({ className, style }: ContractsListProps) {
  const contractsQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
  })

  return match(contractsQuery)
    .with({ status: 'pending' }, () => (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex items-center justify-center">
        <ErrorMessage description={getErrorMessage(error)} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => {
      if (data.length === 0) {
        return <EmptyMessage description="You don't have any ongoing contracts yet." />
      }

      return (
        <div className={cn('border rounded-lg h-full', className)} style={style}>
          <div className="p-4 bg-muted-foreground/5">
            <h1 className="text-lg font-bold">Your ongoing contracts</h1>
          </div>

          <div className="overflow-y-auto max-h-[600px] h-full">
            {data.map((contract) => {
              return (
                <Link
                  key={contract.id}
                  className="border-b px-4 py-2 hover:bg-muted-foreground/5 cursor-pointer block"
                  to={`/contract/${contract.id}`}
                >
                  <h1 className="text-lg font-medium">{contract.title}</h1>
                  <p className="text-xs text-muted-foreground">Started {dayjs(contract.createdAt).fromNow()}</p>
                </Link>
              )
            })}
          </div>
        </div>
      )
    })
    .exhaustive()
}
