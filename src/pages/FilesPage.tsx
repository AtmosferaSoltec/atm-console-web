import { Upload } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { FilesList, UploadDialog, useStorageNames } from '@/features/storage'
import { useTenants } from '@/features/tenants'

export function FilesPage() {
  const { tenants, isLoading } = useTenants()
  const names = useStorageNames(tenants, isLoading)
  const [uploading, setUploading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <PageHeader
        title="Archivos"
        description="Lo que guardaron los sistemas y los logos de las empresas. Descarga o elimina desde aquí."
        actions={
          <Button onClick={() => setUploading(true)}>
            <Upload className="size-4" />
            Subir archivo
          </Button>
        }
      />
      <FilesList names={names} refreshKey={refreshKey} />
      <UploadDialog open={uploading} onClose={() => setUploading(false)} onUploaded={() => setRefreshKey((key) => key + 1)} tenants={names.tenants} />
    </>
  )
}
