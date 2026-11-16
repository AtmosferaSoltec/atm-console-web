import { Info, Plus, Trash2, UserPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FormField } from '@/components/common/FormField'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePulsoActions } from '@/features/pulso'
import { roleLabel } from '@/features/pulso'
import type { TeamMember } from '@/features/pulso/types/pulso.types'
import { DocumentFields, isValidDocument, type UserDocumentType } from '@/features/users'
import type { CompanyTabProps, TeamMemberDialogProps, TeamMemberFormProps } from '../types/pulsoSetup.types'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function TeamMemberForm({ company, systemId, onClose, onSaved }: TeamMemberFormProps) {
  const [documentType, setDocumentType] = useState<UserDocumentType>('dni')
  const [documentNumber, setDocumentNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const { addMember, isBusy, error, clearError } = usePulsoActions()
  const valid = isValidDocument(documentType, documentNumber) && fullName.trim() !== '' && !isBusy

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!valid) return
    if (await addMember({ systemId, tenantId: company.tenantId, documentType, documentNumber, fullName: fullName.trim(), role: 'admin' })) {
      onSaved()
      onClose()
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit} onChange={clearError}>
      <DocumentFields
        idPrefix="team-admin"
        documentType={documentType}
        documentNumber={documentNumber}
        onDocumentTypeChange={setDocumentType}
        onDocumentNumberChange={setDocumentNumber}
        hint="Si ya tiene cuenta en Atmósfera se usa esa. Si no, se crea con su número de documento como clave inicial."
        autoFocus
      />
      <FormField label="Nombre completo" htmlFor="team-admin-name">
        <Input id="team-admin-name" value={fullName} maxLength={200} onChange={(event) => setFullName(event.target.value)} />
      </FormField>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={isBusy}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!valid}>
          {isBusy ? 'Dando acceso…' : 'Dar acceso'}
        </Button>
      </div>
    </form>
  )
}

function TeamMemberDialog({ open, company, systemId, onClose, onSaved }: TeamMemberDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Nuevo administrador" description={`Administra ${company.tradeName} en Pulso: su personal, planes y tarifas.`}>
      {open && <TeamMemberForm company={company} systemId={systemId} onClose={onClose} onSaved={onSaved} />}
    </Dialog>
  )
}

/**
 * People with access to the company in Pulso. The console gives access to the gym's administrators; they create
 * their reception staff in Pulso, where they also choose each person's branches.
 */
export function TeamTab({ company, data, onChanged }: CompanyTabProps) {
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<TeamMember | null>(null)
  const { removeMember, error } = usePulsoActions()
  const systemId = data.systemId
  const members = [...company.team].sort((a, b) => (a.role === b.role ? a.userName.localeCompare(b.userName, 'es') : a.role === 'admin' ? -1 : 1))

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>Aquí das acceso a los administradores del gimnasio. Ellos crean a su personal de recepción desde Pulso, en Configuración › Usuarios.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 px-6 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <UserPlus className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-900">Nadie tiene acceso todavía</p>
            <p className="text-sm text-slate-500">Da acceso al administrador del gimnasio para que empiece a trabajar.</p>
          </div>
          <Button onClick={() => setAdding(true)} disabled={!systemId}>
            <Plus className="size-4" />
            Nuevo administrador
          </Button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-4 px-5 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{initials(member.userName)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{member.userName}</p>
                  <p className="truncate text-xs text-slate-500">{member.userDocumentNumber ? `Documento ${member.userDocumentNumber}` : member.userEmail || 'Sin documento'}</p>
                </div>
                <Badge tone={member.role === 'admin' ? 'info' : 'neutral'} dot={false}>
                  {roleLabel(member.role)}
                </Badge>
                <Button variant="danger-ghost" size="icon" aria-label={`Quitar acceso a ${member.userName}`} onClick={() => setRemoving(member)}>
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="outline" onClick={() => setAdding(true)} disabled={!systemId}>
            <Plus className="size-4" />
            Nuevo administrador
          </Button>
        </>
      )}

      {systemId && <TeamMemberDialog open={adding} company={company} systemId={systemId} onClose={() => setAdding(false)} onSaved={onChanged} />}
      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={() => {
          const member = removing
          setRemoving(null)
          if (member) void removeMember(member.id).then((ok) => ok && onChanged())
        }}
        title={`¿Quitar el acceso a ${removing?.userName ?? ''}?`}
        description="Deja de poder entrar a Pulso en esta empresa. Lo que registró se conserva y su cuenta de Atmósfera sigue existiendo."
        confirmLabel="Quitar acceso"
        destructive
      />
    </div>
  )
}
