import { getDashboardData } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard.types'

export function useDashboard(): DashboardData {
  return getDashboardData()
}
