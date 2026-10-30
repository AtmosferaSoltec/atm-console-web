import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FilterField } from '@/components/common/FilterField'
import { PaginationFooter } from '@/components/common/PaginationFooter'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { useFileActions } from '../hooks/useFileActions'
import { useFiles } from '../hooks/useStorage'
import { ALL_TARGET, LOGO_TARGET, systemTarget } from '../services/storageTargets'
import type { FilesListProps, StoredFile } from '../types/storage.types'
import { FilesTable } from './FilesTable'
import { ImagePreviewDialog } from './ImagePreviewDialog'

const ALL_COMPANIES = 'all'

function emptyMessage(isLoading: boolean, error: string | null, hasFilters: boolean): string {
  if (isLoading) return 'Cargando archivos...'
  if (error) return error
  return hasFilters ? 'No hay archivos con esos filtros.' : 'Todavía no hay archivos guardados.'
}

export function FilesList({ names, refreshKey }: FilesListProps) {
  const [company, setCompany] = useState(ALL_COMPANIES)
  const [target, setTarget] = useState(ALL_TARGET)
  const [offset, setOffset] = useState(0)
  const [deleting, setDeleting] = useState<StoredFile | null>(null)
  const [previewing, setPreviewing] = useState<StoredFile | null>(null)
  const [deletedCount, setDeletedCount] = useState(0)
  const actions = useFileActions()
  const companyId = company === ALL_COMPANIES ? '' : company
  const { files, total, isLoading, error, pageSize } = useFiles({ companyId, target, offset }, refreshKey + deletedCount)

  const companyOptions = useMemo(
    () => [{ value: ALL_COMPANIES, label: 'Todas las empresas' }, ...names.tenants.map((tenant) => ({ value: tenant.id, label: tenant.displayName }))],
    [names.tenants],
  )
  const targetOptions = useMemo(
    () => [
      { value: ALL_TARGET, label: 'Todos los orígenes' },
      { value: LOGO_TARGET, label: 'Logos de empresas' },
      ...Object.entries(names.systemNames).map(([code, name]) => ({ value: systemTarget(code), label: name })),
    ],
    [names.systemNames],
  )

  const changeFilter = (apply: () => void) => {
    apply()
    setOffset(0)
    actions.clearError()
  }

  const confirmDelete = async () => {
    if (!deleting) return
    const file = deleting
    setDeleting(null)
    if (await actions.remove(file)) {
      // Deleting the last row of a page would leave an empty page behind.
      if (files.length === 1 && offset > 0) setOffset(offset - pageSize)
      setDeletedCount((count) => count + 1)
    }
  }

  const first = total === 0 ? 0 : offset + 1
  const last = Math.min(offset + pageSize, total)
  const hasFilters = companyId !== '' || target !== ALL_TARGET

  return (
    <Card>
      <div className="flex flex-col gap-3 p-4 sm:flex-row">
        <FilterField label="Empresa" htmlFor="files-company">
          <Select id="files-company" value={company} onValueChange={(value) => changeFilter(() => setCompany(value))} options={companyOptions} className="sm:w-64" />
        </FilterField>
        <FilterField label="Origen" htmlFor="files-target">
          <Select id="files-target" value={target} onValueChange={(value) => changeFilter(() => setTarget(value))} options={targetOptions} className="sm:w-64" />
        </FilterField>
      </div>
      {actions.error && (
        <p role="alert" className="border-t border-slate-100 bg-red-50 px-5 py-3 text-sm text-red-700">
          {actions.error}
        </p>
      )}
      <div className="border-t border-slate-100">
        <FilesTable
          files={files}
          companyNames={names.companyNames}
          systemNames={names.systemNames}
          emptyMessage={emptyMessage(isLoading, error, hasFilters)}
          busyId={actions.busyId}
          onPreview={setPreviewing}
          onDownload={(file) => void actions.download(file)}
          onDelete={setDeleting}
        />
      </div>
      <PaginationFooter
        summary={total === 0 ? 'Sin archivos' : `Mostrando ${first}-${last} de ${total} archivos`}
        hasPrevious={offset > 0}
        hasNext={offset + pageSize < total}
        onPrevious={() => setOffset(Math.max(0, offset - pageSize))}
        onNext={() => setOffset(offset + pageSize)}
      />
      <ImagePreviewDialog file={previewing} onClose={() => setPreviewing(null)} />
      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
        title="Eliminar archivo"
        description={`Se borrará "${deleting?.filename ?? ''}" del almacenamiento. Esta acción no se puede deshacer y los enlaces de descarga activos dejarán de funcionar.`}
        confirmLabel="Eliminar"
        destructive
      />
    </Card>
  )
}
