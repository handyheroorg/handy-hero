import { Timestamps } from './timestamp'

export type File = Timestamps & {
  id: string
  uploadedById: string
  originalName: string
  mimetype: string
  size: number
  publicUrl: string
}
