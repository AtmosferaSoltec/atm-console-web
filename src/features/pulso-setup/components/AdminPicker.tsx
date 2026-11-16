import { Search, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DocumentFields, formatUserDocument } from '@/features/users'
import type { UserItem } from '@/features/users'
import type { AdminPickerProps } from '../types/pulsoSetup.types'

const MAX_RESULTS = 6

function matches(user: UserItem, term: string): boolean {
  const lower = term.toLowerCase()
  return user.documentNumber.toLowerCase().includes(lower) || user.fullName.toLowerCase().includes(lower) || user.email.toLowerCase().includes(lower)
}

/**
 * Picks who administers a gym: an account that already exists in Atmósfera, found by document or name, or a new
 * one when nobody matches. A new account gets its document number as initial password.
 */
export function AdminPicker({ users, value, onChange, idPrefix }: AdminPickerProps) {
  const [term, setTerm] = useState('')
  const clean = term.trim()
  const people = users.filter((user) => user.documentNumber)
  const results = clean.length >= 2 ? people.filter((user) => matches(user, clean)).slice(0, MAX_RESULTS) : []
  const exact = people.some((user) => user.documentNumber.toLowerCase() === clean.toLowerCase())

  if (value?.userId) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50/50 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900">{value.fullName}</p>
          <p className="text-xs text-slate-500">{formatUserDocument(value)} · cuenta existente</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
          Cambiar
        </Button>
      </div>
    )
  }

  if (value) {
    return (
      <div className="space-y-3 rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-900">Cuenta nueva</p>
          <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="size-4" />
            Buscar otra vez
          </Button>
        </div>
        <DocumentFields
          idPrefix={`${idPrefix}-new`}
          documentType={value.documentType}
          documentNumber={value.documentNumber}
          onDocumentTypeChange={(documentType) => onChange({ ...value, documentType })}
          onDocumentNumberChange={(documentNumber) => onChange({ ...value, documentNumber })}
          hint="Su contraseña inicial es su número de documento; la cambia al entrar."
        />
        <FormField label="Nombre completo" htmlFor={`${idPrefix}-new-name`}>
          <Input id={`${idPrefix}-new-name`} value={value.fullName} maxLength={200} onChange={(event) => onChange({ ...value, fullName: event.target.value })} />
        </FormField>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Input
        id={`${idPrefix}-search`}
        leadingIcon={Search}
        aria-label="Buscar persona por documento o nombre"
        placeholder="Busca por documento o nombre"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
      {results.length > 0 && (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {results.map((user) => (
            <li key={user.id}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
                onClick={() => onChange({ userId: user.id, documentType: user.documentType || 'dni', documentNumber: user.documentNumber, fullName: user.fullName })}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{user.fullName}</span>
                  <span className="block text-xs text-slate-500">{formatUserDocument(user)}</span>
                </span>
                {user.status !== 'active' && <Badge tone="warning">Desactivada</Badge>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {clean.length >= 2 && results.length === 0 && <p className="text-sm text-slate-500">Nadie con “{clean}” en Atmósfera.</p>}
      {clean.length >= 2 && !exact && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const digits = clean.replace(/\D/g, '')
            const looksLikeDocument = digits.length === clean.length
            onChange({ userId: null, documentType: 'dni', documentNumber: looksLikeDocument ? digits.slice(0, 8) : '', fullName: looksLikeDocument ? '' : clean })
          }}
        >
          <UserPlus className="size-4" />
          Crear cuenta nueva
        </Button>
      )}
    </div>
  )
}
