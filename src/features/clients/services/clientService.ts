import { request } from '@/services/httpClient'
import type { ClientItem, ClientListResponse, ClientResponse } from '../types/client.types'

function toClientItem(client: ClientResponse): ClientItem {
  return {
    id: client.id,
    name: client.name,
    tenants: client.tenants.map((tenant) => ({ id: tenant.id, ruc: tenant.ruc ?? '', displayName: tenant.display_name })),
    createdAt: client.created_at,
  }
}

export async function listClients(signal?: AbortSignal): Promise<ClientItem[]> {
  const { items } = await request<ClientListResponse>('/v1/admin/clients', { signal })
  return items.map(toClientItem)
}

export async function createClient(name: string): Promise<ClientItem> {
  return toClientItem(await request<ClientResponse>('/v1/admin/clients', { method: 'POST', body: { name } }))
}

export async function renameClient(clientId: string, name: string): Promise<ClientItem> {
  return toClientItem(await request<ClientResponse>(`/v1/admin/clients/${clientId}`, { method: 'PUT', body: { name } }))
}

/** Only a client without companies can be deleted. */
export async function deleteClient(clientId: string): Promise<void> {
  await request<void>(`/v1/admin/clients/${clientId}`, { method: 'DELETE' })
}
