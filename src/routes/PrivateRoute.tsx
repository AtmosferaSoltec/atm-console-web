import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/hooks/useAuth'

export function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />
  return <Outlet />
}
