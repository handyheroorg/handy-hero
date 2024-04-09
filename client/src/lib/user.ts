import { EmploymentType } from '@/schema'
import { ExperienceLevel } from '@/types'

export const EXPERIENCE_LEVELS_MAPS: Record<
  ExperienceLevel,
  {
    title: string
    description: string
  }
> = {
  ENTRY: {
    title: 'Entry Level',
    description: 'I am relatively new to this field.',
  },
  INTERMEDIATE: {
    title: 'Intermediate',
    description: 'I have substantial experience in this field.',
  },
  EXPERT: {
    title: 'Expert',
    description: 'I have comprehensive and deep expertise in this field.',
  },
}

export const EMPLOYMENT_TYPE_CLASSES: Record<EmploymentType, string> = {
  FULL_TIME: 'text-red-500 border-red-500 bg-red-50',
  PART_TIME: 'text-yellow-500 border-yellow-500 bg-yellow-50',
  FREELANCE: 'text-green-500 border-green-500 bg-green-50',
  INTERNSHIP: 'text-blue-500 border-blue-500 bg-blue-50',
  SELF_EMPLOYED: 'text-violet-500 border-violet-500 bg-violet-50',
  TRAINEE: 'text-sky-500 border-sky-500 bg-sky-50',
}
