import { useParams } from 'react-router-dom'
import { ClientStatement } from '@/features/collections'
import { PublicLayout } from '@/layouts/PublicLayout'

/** Public page: a client opens the link it was sent and sees what it owes. No session. */
export function StatementPage() {
  const { token = '' } = useParams()

  return (
    <PublicLayout wide footer="Atmosfera · Estado de cuenta">
      <ClientStatement token={token} />
    </PublicLayout>
  )
}
