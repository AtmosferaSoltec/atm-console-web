import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { companyPath } from '@/config/routes'
import type { CompanyUsage, UsageTableProps } from '../types/usage.types'

function RemainingBadge({ row }: { row: CompanyUsage }) {
  const remaining = row.limit - row.used
  if (remaining < 0) return <Badge tone="danger">Excedido por {-remaining}</Badge>
  if (row.used >= row.limit * 0.8) return <Badge tone="warning">{remaining} disponibles</Badge>
  return <Badge tone="success">{remaining} disponibles</Badge>
}

export function UsageTable({ rows, emptyMessage = 'No hay empresas activas.' }: UsageTableProps) {
  return (
    <Table className="min-w-[1000px]">
      <THead>
        <Tr>
          <Th>Empresa</Th>
          <Th className="text-right">Facturas</Th>
          <Th className="text-right">Boletas</Th>
          <Th className="text-right">GRE Remitente</Th>
          <Th className="text-right">GRE Transportista</Th>
          <Th className="text-right">Total</Th>
          <Th className="w-56">Plan</Th>
          <Th className="text-right">Disponibles</Th>
        </Tr>
      </THead>
      <TBody>
        {rows.length === 0 && <EmptyRow colSpan={8} message={emptyMessage} />}
        {rows.map((row) => (
          <Tr key={row.companyId}>
            <Td className="min-w-52">
              <Link to={companyPath(row.companyId)} className="font-medium text-slate-900 hover:text-brand-700">
                {row.name}
              </Link>
              <p className="text-xs text-slate-500">
                {row.ruc}
                {!row.isActive && ' · inactiva'}
              </p>
            </Td>
            {[row.invoices, row.receipts, row.greSender, row.greCarrier].map((count, index) => (
              <Td key={index} className={count > 0 ? 'text-right font-mono' : 'text-right font-mono text-slate-400'}>
                {count}
              </Td>
            ))}
            <Td className="text-right font-mono font-semibold text-slate-900">{row.used}</Td>
            <Td>
              <div className="flex items-center gap-3">
                <ProgressBar value={row.used} max={row.limit} />
                <span className="w-20 shrink-0 text-right font-mono text-xs text-slate-500">
                  {row.used}/{row.limit}
                </span>
              </div>
            </Td>
            <Td className="text-right">
              <RemainingBadge row={row} />
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
