import { useState } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog } from '@/components/ui/dialog'
import { formatMoney } from '@/utils/format'
import type { PaymentConfirmDialogProps } from '../types/collections.types'
import { sumByCurrency } from '../utils/balance'
import { formatPeriod } from '../utils/period'
import { MoneyBalances } from './MoneyBalances'

/** Last step of a payment: what is being paid, the total and the date. Nothing else to fill in. */
export function PaymentConfirmDialog({ clientName, charges, isWorking, error, onClose, onConfirm }: PaymentConfirmDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const rows = [...charges].sort((a, b) => a.period.localeCompare(b.period))
  // A payment cannot be dated after today.
  const isFuture = date !== undefined && date > new Date()

  return (
    <Dialog
      open
      onClose={isWorking ? () => undefined : onClose}
      title="Registrar pago"
      description={`${clientName} te pagó ${charges.length === 1 ? 'este cargo' : `estos ${charges.length} cargos`}.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isWorking}>
            Cancelar
          </Button>
          <Button onClick={() => date && onConfirm(date)} disabled={date === undefined || isFuture || isWorking}>
            {isWorking ? 'Registrando...' : 'Confirmar pago'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <ul className="max-h-60 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
          {rows.map((charge) => (
            <li key={charge.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
              <span className="min-w-0 truncate text-slate-700" title={charge.concept}>
                <span className="font-medium text-slate-900">{formatPeriod(charge.period)}</span> · {charge.concept}
              </span>
              <span className="shrink-0 font-medium text-slate-900">{formatMoney(charge.amount, charge.currency)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-end justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-500">Total</span>
          <div className="text-right text-xl">
            <MoneyBalances amounts={sumByCurrency(charges)} />
          </div>
        </div>

        <FormField label="Fecha del pago" htmlFor="payment-date" error={isFuture ? 'La fecha no puede ser posterior a hoy.' : undefined}>
          <DatePicker value={date} onChange={setDate} />
        </FormField>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </Dialog>
  )
}
