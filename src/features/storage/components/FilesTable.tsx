import { Download, Eye, File, FileText, Image as ImageIcon, Trash2, Video } from 'lucide-react'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatBytes, formatDateTime } from '@/utils/format'
import { isPreviewable } from '../services/filePreview'
import type { FileKindConfig, FilesTableProps } from '../types/storage.types'

const COLUMNS = 6

function kindOf(contentType: string): FileKindConfig {
  if (contentType.startsWith('image/')) return { label: 'Imagen', icon: ImageIcon }
  if (contentType.startsWith('video/')) return { label: 'Video', icon: Video }
  if (contentType === 'application/pdf') return { label: 'PDF', icon: FileText }
  if (contentType.startsWith('text/')) return { label: 'Texto', icon: FileText }
  return { label: 'Archivo', icon: File }
}

export function FilesTable({ files, companyNames, systemNames, emptyMessage, busyId, onPreview, onDownload, onDelete }: FilesTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Archivo</Th>
          <Th>Empresa</Th>
          <Th>Origen</Th>
          <Th className="text-right">Tamaño</Th>
          <Th>Subido</Th>
          <Th className="text-right">Acciones</Th>
        </Tr>
      </THead>
      <TBody>
        {files.length === 0 && <EmptyRow colSpan={COLUMNS} message={emptyMessage} />}
        {files.map((file) => {
          const { label, icon: Icon } = kindOf(file.contentType)
          const busy = busyId === file.id
          return (
            <Tr key={file.id}>
              <Td>
                <span className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block max-w-xs truncate font-medium text-slate-900">{file.filename}</span>
                    <span className="block text-xs text-slate-400">{label}</span>
                  </span>
                </span>
              </Td>
              <Td>{companyNames[file.companyId] ?? <span className="font-mono text-xs text-slate-500">{file.companyId.slice(0, 8)}</span>}</Td>
              <Td>
                {file.scope === 'company' ? (
                  <Badge tone="violet" dot={false}>
                    Logo de empresa
                  </Badge>
                ) : (
                  (systemNames[file.system] ?? file.system)
                )}
              </Td>
              <Td className="text-right tabular-nums">{formatBytes(file.size)}</Td>
              <Td className="text-slate-500">{formatDateTime(new Date(file.createdAt))}</Td>
              <Td>
                <span className="flex justify-end gap-1">
                  {isPreviewable(file.contentType) && (
                    <Button variant="ghost" size="icon" aria-label={`Ver ${file.filename}`} disabled={busy} onClick={() => onPreview(file)}>
                      <Eye className="size-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" aria-label={`Descargar ${file.filename}`} disabled={busy} onClick={() => onDownload(file)}>
                    <Download className="size-4" />
                  </Button>
                  <Button variant="danger-ghost" size="icon" aria-label={`Eliminar ${file.filename}`} disabled={busy} onClick={() => onDelete(file)}>
                    <Trash2 className="size-4" />
                  </Button>
                </span>
              </Td>
            </Tr>
          )
        })}
      </TBody>
    </Table>
  )
}
