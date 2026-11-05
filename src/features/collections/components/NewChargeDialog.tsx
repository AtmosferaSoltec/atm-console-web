import { format, startOfToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState, type FormEvent } from 'react'
import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useCreateSubscription } from '../hooks/useCollectionsActions'
import type { Currency, NewChargeDialogProps, Periodicity } from '../types/collections.types'
import { CURRENCY_OPTIONS, CURRENCY_SYMBOLS, PERIODICITY_OPTIONS } from '../utils/labels'

const FORM_ID = 'new-charge-form'

/** Keeps only digits and one decimal point with up to two decimals: '40', '40.5', '1500.00'. */
function toDecimal(value: string): string {
  const clean = value.replace(',', '.').replace(/[^\d.]/g, '')
  const [whole, ...rest] = clean.split('.')
  return rest.length === 0 ? whole : `${whole}.${rest.join('').slice(0, 2)}`
}

/** 'Se cobrará el día 5 de cada mes, desde febrero de 2027.' */
function scheduleHint(periodicity: Periodicity, start: Date | undefined): string | undefined {
  if (!start) return undefined
  const day = start.getDate()
  const shortMonths = day > 28 ? ' En los meses más cortos se cobra el último día.' : ''
  // A start in the past owes every period since then, generated right away.
  const backfill = start < startOfToday() ? ' Como la fecha ya pasó, se crean ahora los cargos desde entonces.' : ''
  if (periodicity === 'monthly') return `Se cobrará el día ${day} de cada mes, desde ${format(start, "MMMM 'de' yyyy", { locale: es })}.${shortMonths}${backfill}`
  return `Se cobrará cada año el ${day} de ${format(start, 'MMMM', { locale: es })}, desde ${format(start, 'yyyy')}.${shortMonths}${backfill}`
}

export function NewChargeDialog({ clients, clientId, onClose, onCreated }: NewChargeDialogProps) {
  const { run, isWorking, error } = useCreateSubscription()
  const [client, setClient] = useState(clientId ?? '')
  const [concept, setConcept] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('PEN')
  const [periodicity, setPeriodicity] = useState<Periodicity>('monthly')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [submitted, setSubmitted] = useState(false)

  const clientError = client === '' ? 'Elige el cliente.' : undefined
  const conceptError = concept.trim() === '' ? 'Escribe qué se le cobra.' : undefined
  const amountError = !(Number(amount) > 0) ? 'Ingresa un monto mayor a cero.' : undefined
  const startError = startDate === undefined ? 'Elige desde cuándo se cobra.' : undefined

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (clientError || conceptError || amountError || startError || !startDate || isWorking) return
    const done = await run({ clientId: client, concept: concept.trim(), amount: Number(amount), currency, periodicity, startDate })
    if (done !== null) onCreated()
  }

  return (
    <Dialog
      open
      onClose={isWorking ? () => undefined : onClose}
      title="Nuevo cobro"
      description="Se repite solo en cada periodo. El día y el mes del primer cobro marcan cuándo se repite."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isWorking}>
            Cancelar
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isWorking}>
            {isWorking ? 'Creando...' : 'Crear cobro'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField label="Cliente" htmlFor="charge-client" error={submitted ? clientError : undefined}>
          <Select
            id="charge-client"
            value={client}
            onValueChange={setClient}
            options={clients.map((item) => ({ value: item.id, label: item.name }))}
            placeholder="Elige un cliente"
          />
        </FormField>
        <FormField label="Descripción" htmlFor="charge-concept" error={submitted ? conceptError : undefined}>
          <Input id="charge-concept" value={concept} maxLength={80} placeholder="Servicio de Nubefact, servidor..." onChange={(event) => setConcept(event.target.value)} invalid={submitted && !!conceptError} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={`Monto (${CURRENCY_SYMBOLS[currency]})`} htmlFor="charge-amount" error={submitted ? amountError : undefined}>
            <Input id="charge-amount" inputMode="decimal" autoComplete="off" value={amount} onChange={(event) => setAmount(toDecimal(event.target.value))} invalid={submitted && !!amountError} />
          </FormField>
          <FormField label="Moneda" htmlFor="charge-currency">
            <Select id="charge-currency" value={currency} onValueChange={(value) => setCurrency(value as Currency)} options={CURRENCY_OPTIONS} />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Periodo" htmlFor="charge-periodicity">
            <Select id="charge-periodicity" value={periodicity} onValueChange={(value) => setPeriodicity(value as Periodicity)} options={PERIODICITY_OPTIONS} />
          </FormField>
          <FormField label="Primer cobro" htmlFor="charge-start" error={submitted ? startError : undefined}>
            <DatePicker value={startDate} onChange={setStartDate} />
          </FormField>
        </div>
        {scheduleHint(periodicity, startDate) && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{scheduleHint(periodicity, startDate)}</p>}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </Dialog>
  )
}
