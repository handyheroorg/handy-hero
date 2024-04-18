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

export type PriceType = Service['priceType']

export type FindServicesFiltersDto = {
  query: string | null
  skills: string[] | null
  minPrice: number | null
  maxPrice: number | null
  priceType: PriceType | null
}
