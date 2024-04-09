import { File } from './file'
import { Timestamps } from './timestamp'

export type Service = Timestamps & {
  id: string
  name: string
  description: string
  thumbnail: File
  price: number
  skills: string[]
  priceType: 'HOURLY' | 'FIXED'
  maxHours: number | null
}
