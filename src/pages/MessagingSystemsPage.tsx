import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ApiClientsTable, CreateApiClientDialog, CredentialsDialog, useApiClients, useSampleCredentials, WebhookDialog } from '@/features/api-clients'
import type { ApiClient } from '@/features/api-clients'

export function ApiClientsPage() {
  const clients = useApiClients()
  const [creating, setCreating] = useState(false)
  const [webhookTarget, setWebhookTarget] = useState<ApiClient | null>(null)
  const [rotateTarget, setRotateTarget] = useState<ApiClient | null>(null)
  const [rotatedCredentialsFor, setRotatedCredentialsFor] = useState<ApiClient | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<ApiClient | null>(null)
  const rotatedCredentials = useSampleCredentials(rotatedCredentialsFor?.name ?? '')

  const handleToggle = (client: ApiClient) => {
    if (client.isActive) setDeactivateTarget(client)
  }

  return (
    <>
      <PageHeader
        title="Sistemas cliente"
        description="Las aplicaciones que envían mensajes por la API. Cada una tiene su propia API key y su webhook."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nuevo sistema
          </Button>
        }
      />

      <Card>
        <ApiClientsTable clients={clients} onConfigureWebhook={setWebhookTarget} onRotateKey={setRotateTarget} onToggleActive={handleToggle} />
      </Card>

      <CreateApiClientDialog open={creating} onClose={() => setCreating(false)} />
      <WebhookDialog client={webhookTarget} onClose={() => setWebhookTarget(null)} />
      <CredentialsDialog credentials={rotatedCredentialsFor ? rotatedCredentials : null} heading="Nueva API key" onClose={() => setRotatedCredentialsFor(null)} />
      <ConfirmDialog
        open={rotateTarget !== null}
        onClose={() => setRotateTarget(null)}
        onConfirm={() => {
          setRotatedCredentialsFor(rotateTarget)
          setRotateTarget(null)
        }}
        title="¿Rotar la API key?"
        description={`La key actual de ${rotateTarget?.name ?? ''} dejará de funcionar al instante. Tendrás que darle la nueva al sistema.`}
        confirmLabel="Rotar key"
      />
      <ConfirmDialog
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => setDeactivateTarget(null)}
        title="¿Desactivar este sistema?"
        description={`${deactivateTarget?.name ?? ''} no podrá usar la API hasta que lo actives de nuevo. Sus conexiones se conservan.`}
        confirmLabel="Desactivar"
        destructive
      />
    </>
  )
}
