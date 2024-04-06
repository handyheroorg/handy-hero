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
