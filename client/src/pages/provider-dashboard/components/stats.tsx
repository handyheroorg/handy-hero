import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { CheckIcon, CircleDashedIcon, ClockIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BasicProps } from '@/types'
import { fetchDashboardStats } from '@/queries/dashboard'
import ErrorMessage from '@/components/error-message'
import { cn, getErrorMessage } from '@/lib'
import StatCard from '@/components/stat-card'
import { ProviderDashboardStats } from '@/types/dashboard'
import { Skeleton } from '@/components/ui'

type StatsProps = BasicProps

export default function Stats({ className, style }: StatsProps) {
  const navigate = useNavigate()

  const statsQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardStats,
  })

  return match(statsQuery)
    .with({ status: 'pending' }, () => (
      <div className="flex items-center flex-wrap gap-4 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg flex-1" />
        ))}
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => <ErrorMessage description={getErrorMessage(error)} />)
    .with({ status: 'success' }, ({ data }: { data: ProviderDashboardStats }) => (
      <div className={cn('flex items-center gap-4 flex-wrap', className)} style={style}>
        <StatCard
          className="flex-1"
          title="Pending chat requests"
          value={data.pendingChatRequests}
          icon={<CircleDashedIcon />}
          iconClassName="text-yellow-500"
          onClick={() => {
            navigate('/chat/requests')
          }}
        />
        <StatCard
          className="flex-1"
          title="Accepted chat requests"
          value={data.acceptedChatRequests}
          icon={<CheckIcon />}
          iconClassName="text-green-500"
        />
        <StatCard
          className="flex-1"
          title="Rejected chat requests"
          value={data.rejectedChatRequests}
          icon={<XIcon />}
          iconClassName="text-red-500"
        />
        <StatCard
          className="flex-1"
          title="Total ongoing contracts"
          value={data.onGoingContracts}
          icon={<ClockIcon />}
          iconClassName="text-blue-500"
        />
      </div>
    ))
    .exhaustive()
}
