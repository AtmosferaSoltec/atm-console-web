import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import type { PersonsTableProps } from '../types/identity.types'

export function PersonsTable({ persons }: PersonsTableProps) {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>DNI</Th>
          <Th>Nombres</Th>
          <Th>Apellido paterno</Th>
          <Th>Apellido materno</Th>
          <Th>Guardado</Th>
        </Tr>
      </THead>
      <TBody>
        {persons.map((person) => (
          <Tr key={person.documentNumber}>
            <Td className="font-mono text-slate-900">{person.documentNumber}</Td>
            <Td>{person.firstNames}</Td>
            <Td>{person.paternalSurname}</Td>
            <Td>{person.maternalSurname}</Td>
            <Td className="text-slate-500">{person.storedAt}</Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
