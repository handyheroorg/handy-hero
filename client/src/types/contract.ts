import { Timestamps } from './timestamp'

export type ContractProposal = Timestamps & {
  id: string
  title: string
  description: string
  chatRoomId: string
  settledPrice: 40
}
