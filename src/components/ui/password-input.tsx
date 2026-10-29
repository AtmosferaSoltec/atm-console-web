import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import type { PasswordInputProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const ToggleIcon = visible ? EyeOff : Eye

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} leadingIcon={Lock} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <ToggleIcon className="size-4" />
      </button>
    </div>
  )
}
