import { Dialog } from '@/components/ui/dialog'
import { formatBytes } from '@/utils/format'
import { usePreviewUrl } from '../hooks/useStorage'
import type { ImagePreviewDialogProps, StoredFile } from '../types/storage.types'

function PreviewImage({ file }: { file: StoredFile }) {
  const { url, error } = usePreviewUrl(file.id)
  if (error) {
    return (
      <p role="alert" className="py-10 text-center text-sm text-red-600">
        No se pudo cargar la vista previa.
      </p>
    )
  }
  if (!url) return <p className="py-10 text-center text-sm text-slate-500">Cargando vista previa...</p>
  return <img src={url} alt={file.filename} className="mx-auto max-h-[70vh] max-w-full rounded-lg bg-slate-50 object-contain" />
}

export function ImagePreviewDialog({ file, onClose }: ImagePreviewDialogProps) {
  return (
    <Dialog open={file !== null} onClose={onClose} size="lg" title={file?.filename ?? ''} description={file ? formatBytes(file.size) : undefined}>
      {file && <PreviewImage file={file} />}
    </Dialog>
  )
}
