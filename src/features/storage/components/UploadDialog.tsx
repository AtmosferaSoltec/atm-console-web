import { UploadCloud } from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { formatBytes } from '@/utils/format'
import { useUploadFile } from '../hooks/useUploadFile'
import { MAX_LOGO_BYTES, MAX_UPLOAD_BYTES } from '../services/storageService'
import { LOGO_TARGET, systemTarget } from '../services/storageTargets'
import type { UploadDialogProps } from '../types/storage.types'

export function UploadDialog({ open, onClose, onUploaded, tenants }: UploadDialogProps) {
  const [companyId, setCompanyId] = useState('')
  const [target, setTarget] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, isUploading, error, clearError } = useUploadFile()

  const tenant = tenants.find((item) => item.id === companyId)
  const targetOptions = useMemo(
    () => [
      { value: LOGO_TARGET, label: 'Logo de la empresa (compartido)' },
      ...(tenant?.systems ?? []).map((system) => ({ value: systemTarget(system.code), label: system.name })),
    ],
    [tenant],
  )
  const isLogo = target === LOGO_TARGET
  const canSubmit = companyId !== '' && target !== '' && file !== null && fileError === null && !isUploading

  const handleClose = () => {
    if (isUploading) return
    setCompanyId('')
    setTarget('')
    setFile(null)
    setFileError(null)
    clearError()
    onClose()
  }

  const validate = (candidate: File | null, logo: boolean): string | null => {
    if (!candidate) return null
    if (candidate.size === 0) return 'El archivo está vacío.'
    if (logo && candidate.size > MAX_LOGO_BYTES) return `El logo no puede superar ${formatBytes(MAX_LOGO_BYTES)}.`
    if (candidate.size > MAX_UPLOAD_BYTES) return `El archivo no puede superar ${formatBytes(MAX_UPLOAD_BYTES)}.`
    if (logo && candidate.type !== 'image/png' && candidate.type !== 'image/jpeg') return 'El logo debe ser PNG o JPEG.'
    return null
  }

  const handleCompanyChange = (value: string) => {
    setCompanyId(value)
    setTarget('')
    setFileError(validate(file, false))
    clearError()
  }

  const handleTargetChange = (value: string) => {
    setTarget(value)
    setFileError(validate(file, value === LOGO_TARGET))
    clearError()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] ?? null
    setFile(chosen)
    setFileError(validate(chosen, isLogo))
    clearError()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit || !file) return
    if (await upload({ companyId, target, file })) {
      onUploaded()
      handleClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Subir archivo"
      description="Elige la empresa y a qué sistema pertenece el archivo. Los sistemas suben los suyos por la API; esto sirve para cargas manuales."
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancelar
          </Button>
          <Button type="submit" form="upload-file-form" disabled={!canSubmit}>
            {isUploading ? 'Subiendo...' : 'Subir'}
          </Button>
        </>
      }
    >
      <form id="upload-file-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Empresa" htmlFor="upload-company">
          <Select
            id="upload-company"
            value={companyId}
            onValueChange={handleCompanyChange}
            placeholder="Elige una empresa"
            options={tenants.map((item) => ({ value: item.id, label: item.displayName }))}
          />
        </FormField>
        <FormField
          label="Destino"
          htmlFor="upload-target"
          hint={tenant && tenant.systems.length === 0 ? 'Esta empresa no tiene sistemas habilitados: solo puedes subir su logo.' : undefined}
        >
          <Select
            id="upload-target"
            value={target}
            onValueChange={handleTargetChange}
            placeholder={companyId ? 'Elige un destino' : 'Primero elige una empresa'}
            options={targetOptions}
            className={companyId ? undefined : 'pointer-events-none opacity-50'}
          />
        </FormField>
        <FormField
          label="Archivo"
          htmlFor="upload-file"
          error={fileError ?? error ?? undefined}
          hint={`Máximo ${formatBytes(MAX_UPLOAD_BYTES)}. Los logos deben ser PNG o JPEG de hasta ${formatBytes(MAX_LOGO_BYTES)}.`}
        >
          <input ref={inputRef} id="upload-file" type="file" accept={isLogo ? 'image/png,image/jpeg' : undefined} onChange={handleFileChange} className="sr-only" />
          <Button variant="outline" className="h-auto w-full flex-col gap-1 border-dashed py-6 font-normal" onClick={() => inputRef.current?.click()}>
            <UploadCloud className="size-7 text-slate-400" />
            {file ? (
              <span className="max-w-full truncate text-slate-900">
                {file.name} <span className="text-slate-400">({formatBytes(file.size)})</span>
              </span>
            ) : (
              <span className="text-slate-600">Haz clic para elegir un archivo</span>
            )}
          </Button>
        </FormField>
      </form>
    </Dialog>
  )
}
