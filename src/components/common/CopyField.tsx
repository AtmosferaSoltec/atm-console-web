import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CopyFieldProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

const COPIED_FEEDBACK_MS = 1800

export function CopyField({ value, mono = true }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5 pl-3">
      <span className={cn('min-w-0 flex-1 truncate text-sm text-slate-700 select-all', mono && 'font-mono text-[13px]')} title={value}>
        {value}
      </span>
      <Button variant={copied ? 'primary' : 'outline'} size="sm" onClick={handleCopy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? 'Copiado' : 'Copiar'}
      </Button>
    </div>
  )
}
