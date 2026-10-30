import { EyeOff, Send } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationFooter } from '@/components/common/PaginationFooter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EMPTY_FILTERS, MessageFilters, MessagesTable, SendMessageDialog, useMessages } from '@/features/messages'
import type { MessageFiltersValue } from '@/features/messages'

const PAGE_SIZE = 25

export function MessagesPage() {
  const [sending, setSending] = useState(false)
  const [filters, setFilters] = useState<MessageFiltersValue>(EMPTY_FILTERS)
  const [page, setPage] = useState(0)
  const { rows, hasMore, isLoading, error } = useMessages(filters, page, PAGE_SIZE)

  const handleFilters = (next: MessageFiltersValue) => {
    setFilters(next)
    setPage(0)
  }

  return (
    <>
      <PageHeader
        title="Mensajes"
        description="Seguimiento de cada envío y su estado de entrega."
        actions={
          <>
            <span className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500 md:inline-flex">
              <EyeOff className="size-3.5" />
              Por privacidad no se muestra el contenido
            </span>
            <Button onClick={() => setSending(true)}>
              <Send className="size-4" />
              Enviar mensaje
            </Button>
          </>
        }
      />

      <Card>
        <MessageFilters value={filters} onChange={handleFilters} />
        <MessagesTable messages={rows} isLoading={isLoading} error={error} />
        <PaginationFooter
          summary={rows.length === 0 ? 'Sin resultados' : `Página ${page + 1} · ${rows.length} ${rows.length === 1 ? 'mensaje' : 'mensajes'}`}
          hasPrevious={page > 0}
          hasNext={hasMore}
          onPrevious={() => setPage((current) => current - 1)}
          onNext={() => setPage((current) => current + 1)}
        />
      </Card>
      <SendMessageDialog open={sending} onClose={() => setSending(false)} />
    </>
  )
}
