import { Prisma } from '@prisma/client'
import { USER_SELECT_FIELDS } from 'src/users/user.fields'

export const CONTRACT_PROPOSAL_INCLUDE = {
  chatRoom: {
    include: {
      service: true,
      client: { select: USER_SELECT_FIELDS },
      provider: { select: USER_SELECT_FIELDS },
    },
  },
} satisfies Prisma.ContractProposalInclude
