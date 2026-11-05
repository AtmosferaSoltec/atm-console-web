import { useCallback, useEffect, useState } from 'react'
import type { ToastMessage, ToastTone } from '@/types/ui.types'

const TOAST_DURATION_MS = 4000

/** State for the `Toast` component: show a message, and it clears itself after a few seconds. */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  const show = useCallback((message: string, tone: ToastTone = 'success') => setToast({ id: Date.now(), tone, message }), [])
  const dismiss = useCallback(() => setToast(null), [])

  return { toast, show, dismiss }
}
