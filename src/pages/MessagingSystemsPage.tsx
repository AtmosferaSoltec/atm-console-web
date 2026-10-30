import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/card'
import { MessagingSystemsTable, useEnableSystem, useMessagingSystems, useSetSystemActive, WebhookDialog } from '@/features/messaging-systems'
import type { MessagingSystem } from '@/features/messaging-systems'

export function MessagingSystemsPage() {
  const { systems, isLoading, error, reload } = useMessagingSystems()
  const enable = useEnableSystem()
  const setActive = useSetSystemActive()
  const [webhookTarget, setWebhookTarget] = useState<MessagingSystem | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<MessagingSystem | null>(null)

  const handleEnable = async (system: MessagingSystem) => {
    if ((await enable.run(system.code)) !== null) reload()
  }

  const handleToggle = async (system: MessagingSystem) => {
    if (system.isActive) {
      setDeactivateTarget(system)
      return
    }
    if (system.tenantId && (await setActive.run(system.tenantId, true)) !== null) reload()
  }

  const handleDeactivate = async () => {
    const target = deactivateTarget
    setDeactivateTarget(null)
    if (target?.tenantId && (await setActive.run(target.tenantId, false)) !== null) reload()
  }

  const actionError = enable.error ?? setActive.error

  return (
    <>
      <PageHeader
        title="Sistemas en mensajería"
        description="Todos los sistemas registrados en Autenticación pueden enviar mensajes con su credencial: aparecen aquí solos la primera vez que lo usan."
      />

      {actionError && <p className="mb-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{actionError}</p>}

      <Card>
        <MessagingSystemsTable
          systems={systems}
          isLoading={isLoading}
          error={error}
          onEnable={handleEnable}
          onConfigureWebhook={setWebhookTarget}
          onToggleActive={handleToggle}
        />
      </Card>

      <WebhookDialog system={webhookTarget} onClose={() => setWebhookTarget(null)} onSaved={reload} />
      <ConfirmDialog
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="¿Desactivar este sistema en mensajería?"
        description={`${deactivateTarget?.name ?? ''} no podrá enviar mensajes hasta que lo actives de nuevo. Sus conexiones se conservan.`}
        confirmLabel="Desactivar"
        destructive
      />
    </>
  )
}
