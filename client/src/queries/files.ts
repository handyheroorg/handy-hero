import { apiClient } from '@/lib'
import { File as ServerFile } from '@/types'

export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<ServerFile>('/files/upload', formData)
  return data
}
