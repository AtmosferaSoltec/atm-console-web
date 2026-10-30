import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SendMessageDialog } from '@/features/messages'
import { ConnectLinkDialog, CreateSessionDialog, SessionsTable, useDeleteSession, useDisconnectSession, useSessions } from '@/features/sessions'
import type { Session } from '@/features/sessions'
import type { FilterChipOption } from '@/types/ui.types'

const STATUS_CHIPS = [
  { value: 'all', label: 'Todas' },
  { value: 'connected', label: 'Conectadas' },
  { value: 'pending_qr', label: 'Esperando QR' },
  { value: 'disconnected', label: 'Desconectadas' },
  { value: 'banned', label: 'Bloqueadas' },
]

export function SessionsPage() {
  const { sessions, isLoading, error, reload } = useSessions()
  const disconnect = useDisconnectSession()
  const remove = useDeleteSession()
  const [filter, setFilter] = useState('all')
  const [creating, setCreating] = useState(false)
  const [linkTarget, setLinkTarget] = useState<Session | null>(null)
  const [sendTarget, setSendTarget] = useState<Session | null>(null)
  const [disconnectTarget, setDisconnectTarget] = useState<Session | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null)

  const chips: FilterChipOption[] = STATUS_CHIPS.map((chip) => ({
    ...chip,
    count: chip.value === 'all' ? sessions.length : sessions.filter((session) => session.status === chip.value).length,
  }))
  const visible = filter === 'all' ? sessions : sessions.filter((session) => session.status === filter)

  const handleDisconnect = async () => {
    const target = disconnectTarget
    setDisconnectTarget(null)
    if (target && (await disconnect.run(target.id)) !== null) reload()
  }

  const handleDelete = async () => {
    const target = deleteTarget
    setDeleteTarget(null)
    if (target && (await remove.run(target.id)) !== null) reload()
  }

  const actionError = disconnect.error ?? remove.error

  return (
    <>
      <PageHeader
        title="Conexiones"
        description="Cada empresa tiene una sola conexión de WhatsApp. Genera un link para que su dueño escanee el QR sin darle acceso a nada más."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nueva conexión
          </Button>
        }
      />

      {actionError && <p className="mb-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{actionError}</p>}

      <Card>
        <FilterChips options={chips} value={filter} onChange={setFilter} />
        <SessionsTable
          sessions={visible}
          isLoading={isLoading}
          error={error}
          onGenerateLink={setLinkTarget}
          onSendMessage={setSendTarget}
          onDisconnect={setDisconnectTarget}
          onDelete={setDeleteTarget}
        />
      </Card>

      <CreateSessionDialog open={creating} onClose={() => setCreating(false)} onCreated={reload} />
      <ConnectLinkDialog session={linkTarget} onClose={() => setLinkTarget(null)} />
      <SendMessageDialog key={sendTarget?.id ?? 'none'} open={sendTarget !== null} onClose={() => setSendTarget(null)} initialSessionId={sendTarget?.id} />
      <ConfirmDialog
        open={disconnectTarget !== null}
        onClose={() => setDisconnectTarget(null)}
        onConfirm={handleDisconnect}
        title="¿Desvincular este número?"
        description={`Se cerrará la sesión de WhatsApp de ${disconnectTarget?.accountRef ?? ''}. La conexión se conserva y podrás volver a vincularla con un link nuevo.`}
        confirmLabel="Desvincular"
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="¿Eliminar esta conexión?"
        description={`Se borrará la conexión de ${deleteTarget?.accountRef ?? ''} junto con su historial de mensajes. No se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
      />
    </>
  )
}
