import { HandCoins, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableFooter } from '@/components/common/TableFooter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Toast } from '@/components/ui/toast'
import { useToast } from '@/hooks/useToast'
import { useCharges, useCollectionClients } from '../hooks/useCollections'
import { useRegisterPayment } from '../hooks/useCollectionsActions'
import type { ChargesBoardProps, ChargeStatus } from '../types/collections.types'
import { sumByCurrency } from '../utils/balance'
import { ChargeFilterBar, ChargesTable } from './ChargesTable'
import { MoneyBalances } from './MoneyBalances'
import { PaymentConfirmDialog } from './PaymentConfirmDialog'

const ALL_CLIENTS = 'all'

export function ChargesBoard({ fixedClientId, initialClientId = null, onPaid }: ChargesBoardProps) {
  const { toast, show, dismiss } = useToast()
  const { clients } = useCollectionClients()
  const [clientId, setClientId] = useState(fixedClientId ?? initialClientId ?? ALL_CLIENTS)
  const [status, setStatus] = useState<ChargeStatus>('pending')
  // Pending charges of the chosen client start selected; this keeps the ones unticked by hand.
  const [unticked, setUnticked] = useState<Set<string>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const payment = useRegisterPayment()

  const { charges, isLoading, error, reload } = useCharges(clientId === ALL_CLIENTS ? null : clientId)
  const client = clients.find((item) => item.id === clientId)
  const visible = charges.filter((charge) => charge.status === status)
  const pending = useMemo(() => charges.filter((charge) => charge.status === 'pending'), [charges])

  // A payment belongs to one client, so charges can be picked only once a client is chosen.
  const canPay = clientId !== ALL_CLIENTS && status === 'pending' && pending.length > 0
  const clientName = client?.name ?? pending[0]?.clientName ?? ''
  const selected = canPay ? pending.filter((charge) => !unticked.has(charge.id)) : []
  const selectedIds = new Set(selected.map((charge) => charge.id))

  const chooseClient = (next: string) => {
    setClientId(next)
    setUnticked(new Set())
  }

  const toggle = (chargeId: string) =>
    setUnticked((current) => {
      const next = new Set(current)
      if (next.has(chargeId)) next.delete(chargeId)
      else next.add(chargeId)
      return next
    })

  const confirm = async (paidOn: Date) => {
    const count = selected.length
    const done = await payment.run({ clientId, chargeIds: [...selectedIds], paidOn })
    if (done === null) return
    setConfirming(false)
    setUnticked(new Set())
    reload()
    onPaid?.()
    show(count === 1 ? 'Pago registrado: 1 cargo marcado como pagado.' : `Pago registrado: ${count} cargos marcados como pagados.`)
  }

  const emptyMessage = isLoading
    ? 'Cargando cargos...'
    : (error ?? (status === 'pending' ? 'No hay cargos pendientes.' : 'Todavía no hay cargos pagados.'))
  const clientOptions = [{ value: ALL_CLIENTS, label: 'Todos los clientes' }, ...clients.map((item) => ({ value: item.id, label: item.name }))]

  return (
    <Card className="overflow-hidden">
      {!fixedClientId && (
        <div className="p-4">
          <Select value={clientId} onValueChange={chooseClient} options={clientOptions} aria-label="Cliente" className="sm:w-80" />
        </div>
      )}
      <ChargeFilterBar charges={charges} value={status} onChange={setStatus} />

      {canPay && (
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-brand-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-600" title={clientName}>
              <span className="font-medium text-slate-900">{clientName}</span> te debe
            </p>
            <div className="mt-0.5 text-2xl">
              <MoneyBalances amounts={sumByCurrency(pending)} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {pending.length === 1 ? '1 cargo pendiente' : `${pending.length} cargos pendientes`}
              {selected.length !== pending.length && ` · elegiste ${selected.length}`}
            </p>
          </div>
          <Button size="lg" disabled={selected.length === 0} onClick={() => setConfirming(true)}>
            <HandCoins className="size-5" />
            {selected.length === pending.length ? 'Registrar pago de todo' : `Registrar pago (${selected.length})`}
          </Button>
        </div>
      )}
      {clientId === ALL_CLIENTS && status === 'pending' && pending.length > 0 && (
        <p className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-sm text-slate-500">
          <Info className="size-4 shrink-0" />
          Elige un cliente para registrar su pago.
        </p>
      )}

      <ChargesTable
        charges={visible}
        showClient={!fixedClientId}
        oldestFirst={status === 'pending'}
        selection={
          canPay
            ? {
                selected: selectedIds,
                onToggle: toggle,
                onToggleAll: (checked) => setUnticked(checked ? new Set() : new Set(pending.map((charge) => charge.id))),
              }
            : undefined
        }
        emptyMessage={emptyMessage}
      />
      <TableFooter shown={visible.length} total={charges.length} noun="cargos" />

      {confirming && (
        <PaymentConfirmDialog
          clientName={clientName}
          charges={selected}
          isWorking={payment.isWorking}
          error={payment.error}
          onClose={() => {
            payment.clearError()
            setConfirming(false)
          }}
          onConfirm={confirm}
        />
      )}
      <Toast toast={toast} onDismiss={dismiss} />
    </Card>
  )
}
