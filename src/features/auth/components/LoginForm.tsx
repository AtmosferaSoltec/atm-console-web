import { ArrowRight, ShieldCheck, User } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import type { LoginFormProps } from '../types/auth.types'

const CODE_LENGTH = 6

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({ username, password, code })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <FormField label="Usuario" htmlFor="username">
        <Input
          id="username"
          autoComplete="username"
          placeholder="Ingresa tu usuario"
          leadingIcon={User}
          className="h-11"
          value={username}
          onChange={(event) => setUsername(event.target.value.trim())}
          autoFocus
        />
      </FormField>

      <FormField label="Contraseña" htmlFor="password">
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          className="h-11"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>

      <FormField label="Código de verificación" htmlFor="code">
        <Input
          id="code"
          // one-time-code lets Apple Passwords and other managers fill the current 6-digit code.
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={CODE_LENGTH}
          placeholder="Código de 6 dígitos de tu app"
          leadingIcon={ShieldCheck}
          className="h-11 tracking-widest"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))}
        />
      </FormField>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading || !username || !password || code.length !== CODE_LENGTH}>
        {isLoading ? 'Ingresando...' : 'Ingresar'}
        {!isLoading && <ArrowRight className="size-4" />}
      </Button>
    </form>
  )
}
