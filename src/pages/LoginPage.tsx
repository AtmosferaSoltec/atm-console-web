import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { LoginForm, useLogin } from '@/features/auth'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/layouts/AuthLayout'

interface LoginLocationState {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { login, isLoading, error } = useLogin()

  const destination = (location.state as LoginLocationState | null)?.from ?? ROUTES.auth.systems

  if (isAuthenticated) return <Navigate to={destination} replace />

  return (
    <AuthLayout>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Bienvenido</h1>
      <p className="mt-2 text-sm text-slate-500">Ingresa con tu cuenta de administrador para continuar.</p>

      <LoginForm
        onSubmit={async (values) => {
          if (await login(values)) navigate(destination, { replace: true })
        }}
        isLoading={isLoading}
        error={error}
      />

      <p className="mt-8 text-center text-xs text-slate-400">Acceso exclusivo para administradores de Atmosfera.</p>
    </AuthLayout>
  )
}
