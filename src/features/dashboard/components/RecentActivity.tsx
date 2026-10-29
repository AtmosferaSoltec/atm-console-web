import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { RecentActivityProps } from '../types/dashboard.types'

export function RecentActivity({ messages, invoices }: RecentActivityProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <div>
          <CardTitle>Actividad reciente</CardTitle>
          <CardDescription>Lo último que pasó en todos los servicios</CardDescription>
        </div>
      </CardHeader>

      <Tabs defaultValue="messages" className="mt-3">
        <TabsList>
          <TabsTrigger value="messages">Mensajes</TabsTrigger>
          <TabsTrigger value="invoices">Comprobantes</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Table>
            <THead>
              <Tr>
                <Th>Destinatario</Th>
                <Th>Sistema</Th>
                <Th>Tipo</Th>
                <Th>Estado</Th>
                <Th className="text-right">Hora</Th>
              </Tr>
            </THead>
            <TBody>
              {messages.map((message) => (
                <Tr key={message.id}>
                  <Td className="font-medium text-slate-900">{message.recipient}</Td>
                  <Td>{message.system}</Td>
                  <Td>{message.kind}</Td>
                  <Td>
                    <Badge tone={message.statusTone}>{message.status}</Badge>
                  </Td>
                  <Td className="text-right text-slate-500">{message.time}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </TabsContent>

        <TabsContent value="invoices">
          <Table>
            <THead>
              <Tr>
                <Th>Número</Th>
                <Th>Empresa</Th>
                <Th>Cliente</Th>
                <Th className="text-right">Total</Th>
                <Th>Estado</Th>
                <Th className="text-right">Hora</Th>
              </Tr>
            </THead>
            <TBody>
              {invoices.map((invoice) => (
                <Tr key={invoice.id}>
                  <Td className="font-mono font-medium text-slate-900">{invoice.number}</Td>
                  <Td>{invoice.company}</Td>
                  <Td>{invoice.client}</Td>
                  <Td className="text-right font-mono">{invoice.total}</Td>
                  <Td>
                    <Badge tone={invoice.statusTone}>{invoice.status}</Badge>
                  </Td>
                  <Td className="text-right text-slate-500">{invoice.time}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
