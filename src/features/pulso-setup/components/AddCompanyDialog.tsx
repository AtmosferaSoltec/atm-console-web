import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { pulsoErrorMessage } from '@/features/pulso'
import { companyProblems, emptyCompany } from '../services/drafts'
import { createCompanies } from '../services/pulsoAdminService'
import type { AddCompanyDialogProps, AddCompanyFormProps, DraftCompany } from '../types/pulsoSetup.types'
import { CompanyDraftFields } from './CompanyDraftFields'
import { ModulePicker } from './ModulePicker'

/** Adds one more company (with branches and modules) to an existing client. */
export function AddCompanyDialog({ client, data, onClose, onCreated }: AddCompanyDialogProps) {
  return (
    <Dialog open={client !== null} onClose={onClose} title={`Nueva empresa de ${client?.name ?? ''}`} description="Otra marca del mismo cliente, con su RUC y sus sedes." size="lg">
      {client && <AddCompanyForm key={client.id} client={client} data={data} onClose={onClose} onCreated={onCreated} />}
    </Dialog>
  )
}

function AddCompanyForm({ client, data, onClose, onCreated }: AddCompanyFormProps) {
  const [draft, setDraft] = useState<DraftCompany>(() => emptyCompany())
  const [showProblems, setShowProblems] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  const problems = companyProblems(draft)

  const save = async () => {
    if (problems.length) {
      setShowProblems(true)
      return
    }
    if (!data.systemId) {
      setFailure('Pulso no está registrado como sistema en Atmósfera.')
      return
    }
    setFailure(null)
    setProgress('Empezando…')
    try {
      onCreated(await createCompanies(client.id, [draft], data.systemId, setProgress))
    } catch (caught) {
      setFailure(`${pulsoErrorMessage(caught, 'No se pudo terminar.')} Revisa la lista antes de intentar de nuevo: lo que se alcanzó a crear quedó guardado.`)
      setProgress(null)
    }
  }

  return (
    <div className="space-y-5">
      <CompanyDraftFields draft={draft} onChange={setDraft} />
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Módulos</p>
        <ModulePicker modules={data.modules} selected={draft.modules} onChange={(modules) => setDraft({ ...draft, modules })} />
      </div>
      {showProblems && problems.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      )}
      {progress && (
        <p role="status" className="rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {progress}
        </p>
      )}
      {failure && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {failure}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={progress !== null}>
          Cancelar
        </Button>
        <Button onClick={() => void save()} disabled={progress !== null}>
          {progress ? 'Creando…' : 'Crear empresa'}
        </Button>
      </div>
    </div>
  )
}
