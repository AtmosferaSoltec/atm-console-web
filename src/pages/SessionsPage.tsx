import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SendMessageDialog } from '@/features/messages'
import { ConnectLinkDialog, CreateSessionDialog, SessionsTable, useSessions } from '@/features/sessions'
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
  const sessions = useSessions()
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

      <Card>
        <FilterChips options={chips} value={filter} onChange={setFilter} />
        <SessionsTable sessions={visible} onGenerateLink={setLinkTarget} onSendMessage={setSendTarget} onDisconnect={setDisconnectTarget} onDelete={setDeleteTarget} />
      </Card>

      <CreateSessionDialog open={creating} onClose={() => setCreating(false)} />
      <ConnectLinkDialog session={linkTarget} onClose={() => setLinkTarget(null)} />
      <SendMessageDialog key={sendTarget?.id ?? 'none'} open={sendTarget !== null} onClose={() => setSendTarget(null)} initialSessionId={sendTarget?.id} />
      <ConfirmDialog
        open={disconnectTarget !== null}
        onClose={() => setDisconnectTarget(null)}
        onConfirm={() => setDisconnectTarget(null)}
        title="¿Desvincular este número?"
        description={`Se cerrará la sesión de WhatsApp de ${disconnectTarget?.accountRef ?? ''}. La conexión se conserva y podrás volver a vincularla con un link nuevo.`}
        confirmLabel="Desvincular"
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
        title="¿Eliminar esta conexión?"
        description={`Se borrará la conexión de ${deleteTarget?.accountRef ?? ''} junto con su historial de mensajes. No se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
      />
    </>
  )
}
