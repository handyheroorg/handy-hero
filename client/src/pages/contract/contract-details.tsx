import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import { fetchContract } from '@/queries'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/error-message'
import { getErrorMessage } from '@/lib'
import Container from '@/components/container'
import EndContractButton from './components/end-contract-button'
import ReleasePaymentButton from './components/release-payment-button'

export function ContractDetails() {
  const { id } = useParams() as { id: string }

  const contractQuery = useQuery({
    queryKey: ['contract', id],
    queryFn: () => fetchContract(id),
  })

  return match(contractQuery)
    .with({ status: 'pending' }, () => <Loading />)
    .with({ status: 'error' }, ({ error }) => <ErrorMessage description={getErrorMessage(error)} />)
    .with({ status: 'success' }, ({ data }) => (
      <Container>
        <div className="bg-green-900 text-white px-6 py-10 rounded-2xl mb-4 flex justify-between">
          <div>
            <p className="text-xs text-gray-50">Started {dayjs(data.createdAt).fromNow()}</p>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{data.title}</h1>
            <div className="text-sm">{data.description}</div>
          </div>

          <EndContractButton contractId={data.id} />
        </div>

        <div className="px-6 py-10 rounded-2xl bg-gray-50 mb-4">
          <div>
            <p className="text-sm">Project Price</p>
            <p className="text-2xl font-medium">${data.settledPrice}</p>
            <p className="capitalize">{data.service.priceType.toLowerCase()}-price</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <ReleasePaymentButton contractId={data.id} status={data.status} />
        </div>
      </Container>
    ))
    .exhaustive()
}
