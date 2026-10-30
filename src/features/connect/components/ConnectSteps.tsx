const STEPS: string[] = [
  'Abre WhatsApp en tu celular',
  'Toca Menú o Ajustes y elige Dispositivos vinculados',
  'Toca Vincular un dispositivo y apunta la cámara a este código',
]

export function ConnectSteps() {
  return (
    <ol className="mx-auto mt-8 max-w-sm space-y-3.5">
      {STEPS.map((step, index) => (
        <li key={step} className="flex items-start gap-3.5 text-left">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            {index + 1}
          </span>
          <span className="text-sm leading-6 text-slate-600">{step}</span>
        </li>
      ))}
    </ol>
  )
}
