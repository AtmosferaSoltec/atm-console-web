import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyRow } from '@/components/common/EmptyRow'
import { ListToolbar } from '@/components/common/ListToolbar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableFooter } from '@/components/common/TableFooter'
import { Card } from '@/components/ui/card'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { companyPath } from '@/config/routes'
import { formatDate } from '@/utils/format'
import type { CompaniesListProps } from '../types/company.types'
import { TestBadge } from './TestBadge'

function emptyMessage(isLoading: boolean, error: string | null, total: number): string {
  if (isLoading) return 'Cargando empresas...'
  if (error) return error
  return total === 0 ? 'Todavía no hay empresas emisoras.' : 'No hay empresas con esos filtros.'
}

export function CompaniesList({ companies, isLoading, error }: CompaniesListProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return companies.filter(
      (company) =>
        (status === 'all' || (status === 'active') === company.isActive) && (term === '' || company.name.toLowerCase().includes(term) || company.ruc.includes(term)),
    )
  }, [companies, search, status])

  return (
    <Card>
      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por razón social o RUC" status={status} onStatusChange={setStatus} />
      <div className="border-t border-slate-100">
        <Table>
          <THead>
            <Tr>
              <Th>RUC</Th>
              <Th>Razón social</Th>
              <Th>Token Nubefact</Th>
              <Th>Estado</Th>
              <Th>Creada</Th>
              <Th className="w-10" />
            </Tr>
          </THead>
          <TBody>
            {visible.length === 0 && <EmptyRow colSpan={6} message={emptyMessage(isLoading, error, companies.length)} />}
            {visible.map((company) => (
              <Tr key={company.id}>
                <Td className="font-mono text-slate-600">{company.ruc}</Td>
                <Td>
                  <Link to={companyPath(company.id)} className="inline-flex items-center gap-2 font-medium text-slate-900 hover:text-brand-700">
                    {company.name}
                    {company.isTest && <TestBadge />}
                  </Link>
                </Td>
                <Td className="font-mono text-slate-500">{company.nubefactTokenLast4 ? `••••${company.nubefactTokenLast4}` : <span className="text-slate-400">Sin token</span>}</Td>
                <Td>
                  <StatusBadge status={company.isActive ? 'active' : 'disabled'} />
                </Td>
                <Td className="text-slate-500">{formatDate(new Date(company.createdAt))}</Td>
                <Td>
                  <Link to={companyPath(company.id)} aria-label={`Ver ${company.name}`} className="text-slate-300 transition hover:text-slate-600">
                    <ChevronRight className="size-4" />
                  </Link>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
      <TableFooter shown={visible.length} total={companies.length} noun="empresas" />
    </Card>
  )
}
