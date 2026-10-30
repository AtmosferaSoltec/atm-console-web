import { request } from '@/services/httpClient'
import type { CreateTenantInput, TenantItem, TenantListResponse, TenantResponse, UpdateTenantInput } from '../types/tenant.types'

function toTenantItem(tenant: TenantResponse): TenantItem {
  return {
    id: tenant.id,
    ruc: tenant.ruc ?? '',
    legalName: tenant.legal_name,
    tradeName: tenant.trade_name,
    displayName: tenant.display_name,
    address: tenant.address,
    department: tenant.department,
    province: tenant.province,
    district: tenant.district,
    ubigeo: tenant.ubigeo,
    phone: tenant.phone,
    email: tenant.email,
    logoFileId: tenant.logo_file_id ?? '',
    clientId: tenant.client_id,
    clientName: tenant.client_name,
    status: tenant.status,
    systems: tenant.systems,
    createdAt: tenant.created_at,
  }
}

export async function listTenants(signal?: AbortSignal): Promise<TenantItem[]> {
  const { items } = await request<TenantListResponse>('/v1/admin/tenants', { signal })
  return items.map(toTenantItem)
}

export async function createTenant(input: CreateTenantInput): Promise<TenantItem> {
  const tenant = await request<TenantResponse>('/v1/admin/tenants', {
    method: 'POST',
    body: { ...(input.ruc ? { ruc: input.ruc } : {}), legal_name: input.legalName, trade_name: input.tradeName, ...(input.clientId ? { client_id: input.clientId } : {}) },
  })
  return toTenantItem(tenant)
}

/** Replaces the whole profile: a field sent empty is cleared. The RUC cannot change. */
export async function updateTenant(tenantId: string, input: UpdateTenantInput): Promise<TenantItem> {
  const tenant = await request<TenantResponse>(`/v1/admin/tenants/${tenantId}`, {
    method: 'PUT',
    body: {
      legal_name: input.legalName,
      trade_name: input.tradeName,
      address: input.address,
      department: input.department,
      province: input.province,
      district: input.district,
      ubigeo: input.ubigeo,
      phone: input.phone,
      email: input.email,
      logo_file_id: input.logoFileId,
    },
  })
  return toTenantItem(tenant)
}

export async function enableTenantSystem(tenantId: string, systemId: string): Promise<void> {
  await request<void>(`/v1/admin/tenants/${tenantId}/systems`, { method: 'POST', body: { system_id: systemId } })
}

export async function disableTenantSystem(tenantId: string, systemId: string): Promise<void> {
  await request<void>(`/v1/admin/tenants/${tenantId}/systems/${systemId}`, { method: 'DELETE' })
}

/** Moves the company to another client. */
export async function setTenantClient(tenantId: string, clientId: string): Promise<TenantItem> {
  const tenant = await request<TenantResponse>(`/v1/admin/tenants/${tenantId}/client`, { method: 'PUT', body: { client_id: clientId } })
  return toTenantItem(tenant)
}
