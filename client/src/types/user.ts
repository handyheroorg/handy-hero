import { Timestamps } from './timestamp'

export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export type User = Timestamps & {
  id: string
  fullName: string
  email: string
  role: Role
}
