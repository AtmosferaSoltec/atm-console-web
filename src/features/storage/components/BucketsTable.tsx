import { Globe, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { formatNumber } from '@/utils/format'
import type { BucketsTableProps } from '../types/storage.types'

export function BucketsTable({ buckets }: BucketsTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>Bucket</Th>
          <Th>Sistema</Th>
          <Th>Acceso</Th>
          <Th className="text-right">Archivos</Th>
          <Th className="text-right">Tamaño</Th>
          <Th>Creado</Th>
        </Tr>
      </THead>
      <TBody>
        {buckets.map((bucket) => (
          <Tr key={bucket.id}>
            <Td className="font-mono font-medium text-slate-900">{bucket.name}</Td>
            <Td>{bucket.systemName}</Td>
            <Td>
              <Badge tone={bucket.isPublic ? 'warning' : 'neutral'} dot={false}>
                {bucket.isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                {bucket.isPublic ? 'Público' : 'Privado'}
              </Badge>
            </Td>
            <Td className="text-right tabular-nums">{formatNumber(bucket.filesCount)}</Td>
            <Td className="text-right tabular-nums">{bucket.sizeGb} GB</Td>
            <Td className="text-slate-500">{bucket.createdAt}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
