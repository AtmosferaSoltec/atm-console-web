import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'
import { useToast } from '@/hooks/useToast'
import type { NewChargeActionProps } from '../types/collections.types'
import { NewChargeDialog } from './NewChargeDialog'

/** The "Nuevo cobro" button with its dialog and its confirmation toast. */
export function NewChargeAction({ clients, clientId, compact = false, onCreated }: NewChargeActionProps) {
  const [open, setOpen] = useState(false)
  const { toast, show, dismiss } = useToast()

  return (
    <>
      <Button variant="outline" size={compact ? 'sm' : 'md'} onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nuevo cobro
      </Button>
      {open && (
        <NewChargeDialog
          clients={clients}
          clientId={clientId}
          onClose={() => setOpen(false)}
          onCreated={() => {
            setOpen(false)
            show('Cobro creado.')
            onCreated()
          }}
        />
      )}
      <Toast toast={toast} onDismiss={dismiss} />
    </>
  )
}
