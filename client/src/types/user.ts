import { Education, Experience } from '@/schema'
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
  avatar?: string | null
  country: string
  isOnboarded: boolean
  mobileNumber: string
  location: Location | null
}

export type Location = Timestamps & {
  id: string
  latitude: number
  longitude: number
}

export type Profile = {
  id: string
  userId: string
  occupation?: string
  about?: string
  fullAddress?: string
  languages: string[]
  skills: string[]
  experienceLevel: ExperienceLevel
  education: Education[]
  experience: Experience[]
  completionPercentage: number
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT',
}
