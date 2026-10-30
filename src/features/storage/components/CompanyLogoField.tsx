import { ImageOff, UploadCloud } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/utils/format'
import { usePreviewUrl } from '../hooks/useStorage'
import { useUploadFile } from '../hooks/useUploadFile'
import { MAX_LOGO_BYTES } from '../services/storageService'
import { LOGO_TARGET } from '../services/storageTargets'
import type { CompanyLogoFieldProps } from '../types/storage.types'

function LogoPreview({ fileId }: { fileId: string }) {
  const { url, error } = usePreviewUrl(fileId)
  if (error) return <span className="px-1 text-center text-xs text-red-600">No se pudo cargar</span>
  if (!url) return <span className="text-xs text-slate-400">Cargando...</span>
  return <img src={url} alt="Logo de la empresa" className="size-full object-contain" />
}

/** Uploads the company logo as soon as it is chosen; the caller saves the returned id on the company. */
export function CompanyLogoField({ companyId, logoFileId, onChange, disabled = false }: CompanyLogoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const { upload, isUploading, error, clearError } = useUploadFile()

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    clearError()
    setFileError(null)
    if (!file) return
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') return setFileError('El logo debe ser PNG o JPEG.')
    if (file.size > MAX_LOGO_BYTES) return setFileError(`El logo no puede superar ${formatBytes(MAX_LOGO_BYTES)}.`)
    const stored = await upload({ companyId, target: LOGO_TARGET, file })
    if (stored) onChange(stored.id)
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-slate-300">
          {logoFileId ? <LogoPreview key={logoFileId} fileId={logoFileId} /> : <ImageOff className="size-6" />}
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={inputRef} type="file" accept="image/png,image/jpeg" onChange={handleChange} className="sr-only" aria-label="Elegir logo" />
          <Button variant="outline" size="sm" disabled={disabled || isUploading} onClick={() => inputRef.current?.click()}>
            <UploadCloud className="size-4" />
            {isUploading ? 'Subiendo...' : logoFileId ? 'Cambiar logo' : 'Subir logo'}
          </Button>
          {logoFileId && (
            <Button variant="danger-ghost" size="sm" disabled={disabled || isUploading} onClick={() => onChange('')}>
              Quitar
            </Button>
          )}
        </div>
      </div>
      {(fileError ?? error) && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {fileError ?? error}
        </p>
      )}
    </div>
  )
}
