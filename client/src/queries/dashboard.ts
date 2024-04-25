import { apiClient } from '@/lib'

export async function fetchDashboardStats() {
  const { data } = await apiClient.get('/dashboard/stats')
  return data
}
