import { Upload } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FilesTable, UploadDialog, useFiles } from '@/features/storage'

export function FilesPage() {
  const files = useFiles()
  const [uploading, setUploading] = useState(false)

  return (
    <>
      <PageHeader
        title="Archivos"
        description="Lo último que subieron los sistemas, en todos los buckets."
        actions={
          <Button onClick={() => setUploading(true)}>
            <Upload className="size-4" />
            Subir archivos
          </Button>
        }
      />
      <Card>
        <FilesTable files={files} />
      </Card>
      <UploadDialog open={uploading} onClose={() => setUploading(false)} />
    </>
  )
}
