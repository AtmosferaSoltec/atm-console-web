import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Toast } from '@/components/ui/toast'
import { useToast } from '@/hooks/useToast'
import type { NewClientActionProps } from '../types/collections.types'
import { CollectionClientDialog } from './CollectionClientDialog'

/** The "Nuevo cliente" button with its dialog and its confirmation toast. */
export function NewClientAction({ onCreated }: NewClientActionProps) {
  const [open, setOpen] = useState(false)
  const { toast, show, dismiss } = useToast()

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nuevo cliente
      </Button>
      {open && (
        <CollectionClientDialog
          onClose={() => setOpen(false)}
          onCreated={() => {
            setOpen(false)
            show('Cliente agregado.')
            onCreated()
          }}
        />
      )}
      <Toast toast={toast} onDismiss={dismiss} />
    </>
  )
}
