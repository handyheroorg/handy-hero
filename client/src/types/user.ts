import { Education, Experience } from '@/schema'
import { Timestamps } from './timestamp'
import { File } from './file'

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
  avatar?: File | null
  country: string
  isOnboarded: boolean
  mobileNumber: string
  location: Location | null
  isPaymentVerified: boolean
  isMobileNumberVerified: boolean
  isEmailVerified: boolean
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
