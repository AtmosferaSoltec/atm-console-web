import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { DialogProps } from '@/types/ui.types'
import { cn } from '@/utils/cn'

export function Dialog({ open, onClose, title, description, children, footer, size = 'md' }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 animate-fade-in bg-slate-900/50 backdrop-blur-[2px]" />
        <RadixDialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'fixed top-1/2 left-1/2 z-50 max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-pop outline-none',
            size === 'md' ? 'max-w-md' : 'max-w-xl',
          )}
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <RadixDialog.Title className="text-lg font-semibold text-slate-900">{title}</RadixDialog.Title>
              {description && <RadixDialog.Description className="mt-1 text-sm text-slate-500">{description}</RadixDialog.Description>}
            </div>
            <RadixDialog.Close
              aria-label="Cerrar"
              className="-mt-1 -mr-2 cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-5" />
            </RadixDialog.Close>
          </div>
          {children && <div className="px-6 py-5">{children}</div>}
          {footer && (
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">{footer}</div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
