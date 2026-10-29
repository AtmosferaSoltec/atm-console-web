import { File, FileText, Image as ImageIcon, Video } from 'lucide-react'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { FileKind, FileKindConfig, FilesTableProps } from '../types/storage.types'

const KIND_CONFIG: Record<FileKind, FileKindConfig> = {
  image: { label: 'Imagen', icon: ImageIcon },
  pdf: { label: 'PDF', icon: FileText },
  document: { label: 'Documento', icon: FileText },
  video: { label: 'Video', icon: Video },
  other: { label: 'Otro', icon: File },
}

export function FilesTable({ files }: FilesTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Archivo</Th>
          <Th>Bucket</Th>
          <Th>Tipo</Th>
          <Th className="text-right">Tamaño</Th>
          <Th>Subido</Th>
        </Tr>
      </THead>
      <TBody>
        {files.map((file) => {
          const { label, icon: Icon } = KIND_CONFIG[file.kind]
          return (
            <Tr key={file.id}>
              <Td>
                <span className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="size-4" />
                  </span>
                  <span className="truncate font-medium text-slate-900">{file.name}</span>
                </span>
              </Td>
              <Td className="font-mono text-xs text-slate-600">{file.bucketName}</Td>
              <Td>{label}</Td>
              <Td className="text-right tabular-nums">{file.size}</Td>
              <Td className="text-slate-500">{file.uploadedAt}</Td>
            </Tr>
          )
        })}
      </TBody>
    </Table>
  )
}
