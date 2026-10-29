import { UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { useBuckets } from '../hooks/useStorage'
import type { StorageDialogProps } from '../types/storage.types'

export function UploadDialog({ open, onClose }: StorageDialogProps) {
  const buckets = useBuckets()
  const [bucketId, setBucketId] = useState('')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Subir archivos"
      description="Pruebas manuales: los sistemas suben sus archivos por la API."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Subir</Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Bucket" htmlFor="upload-bucket">
          <Select id="upload-bucket" value={bucketId} onValueChange={setBucketId} placeholder="Elige un bucket" options={buckets.map((bucket) => ({ value: bucket.id, label: bucket.name }))} />
        </FormField>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center">
          <UploadCloud className="size-8 text-slate-400" />
          <p className="text-sm text-slate-600">Arrastra archivos aquí o haz clic para elegirlos</p>
          <p className="text-xs text-slate-400">Máximo 100 MB por archivo</p>
        </div>
      </div>
    </Dialog>
  )
}
