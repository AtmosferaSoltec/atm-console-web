import { listClients } from '@/features/clients'
import { addMember, createBranch, listPulsoGroups, listPulsoModules, listPulsoTeam, updateBranch, updateGymFeatures } from '@/features/pulso'
import type { Gym } from '@/features/pulso/types/pulso.types'
import { createTenant, enableTenantSystem, listTenants } from '@/features/tenants'
import { listUsers } from '@/features/users'
import type { ClientDraft, ClientSummary, Company, CreationStep, DraftCompany, PulsoAdminData } from '../types/pulsoSetup.types'
import { toModules } from './moduleCatalog'

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'es')

/**
 * Loads the whole Pulso administration at once: the gyms from pulso-api, and the clients, companies and people from
 * auth-api. A gym is a company of an auth client with Pulso enabled, so the clients are the auth clients that own
 * at least one gym.
 */
export async function loadPulsoAdmin(signal: AbortSignal): Promise<PulsoAdminData> {
  const [groups, authClients, team, catalog, tenants, users] = await Promise.all([
    listPulsoGroups(signal),
    listClients(signal),
    listPulsoTeam(signal),
    listPulsoModules(signal),
    listTenants(signal),
    listUsers(signal),
  ])
  const gyms = groups.flatMap((group) => group.gyms)
  const companies: Company[] = gyms
    .map((gym) => toCompany(gym, team.members, tenants))
    .sort((a, b) => a.tradeName.localeCompare(b.tradeName, 'es'))
  const groupNames = new Map(groups.flatMap((group) => group.gyms.map((gym) => [gym.authClientId, group.name] as const)))
  const clientIds = [...new Set(companies.map((company) => company.clientId))]
  const clients: ClientSummary[] = clientIds
    .map((id) => {
      const own = companies.filter((company) => company.clientId === id)
      return {
        id,
        name: authClients.find((client) => client.id === id)?.name ?? groupNames.get(id) ?? 'Cliente',
        companies: own,
        branchCount: own.reduce((total, company) => total + company.branches.length, 0),
      }
    })
    .sort(byName)
  return { clients, companies, authClients: [...authClients].sort(byName), modules: toModules(catalog), users, systemId: team.systemId }
}

function toCompany(gym: Gym, members: Company['team'], tenants: Awaited<ReturnType<typeof listTenants>>): Company {
  const tenant = tenants.find((item) => item.id === gym.tenantId)
  return {
    id: gym.id,
    tenantId: gym.tenantId,
    clientId: gym.authClientId,
    tradeName: tenant?.displayName || gym.name,
    ruc: gym.ruc || tenant?.ruc || '',
    brandColor: gym.brandColor,
    status: gym.status,
    branches: gym.branches,
    modules: gym.features,
    team: members.filter((member) => member.tenantId === gym.tenantId),
    tenant,
  }
}

/**
 * Gives Pulso to an existing client: creates each company, then sets up each gym in Pulso (branches, optional modules
 * and its first admin). Returns the id of the first gym. A failure stops at that point; what was created stays, and
 * the list shows it.
 */
export async function addClientToPulso(draft: ClientDraft, systemId: string, onStep: CreationStep): Promise<string> {
  if (!draft.clientId) throw new Error('Elige un cliente.')
  return createCompanies(draft.clientId, draft.companies, systemId, onStep)
}

export async function createCompanies(clientId: string, drafts: DraftCompany[], systemId: string, onStep: CreationStep): Promise<string> {
  const tenantIds: string[] = []
  for (const draft of drafts) {
    const name = draft.tradeName.trim()
    onStep(`Creando la empresa ${name}…`)
    const tenant = await createTenant({ ruc: draft.ruc.trim(), legalName: name, tradeName: name, clientId })
    await enableTenantSystem(tenant.id, systemId)
    tenantIds.push(tenant.id)
  }

  // Listing the gyms makes Pulso record the new companies as gyms, each with its main branch.
  onStep('Preparando los gimnasios en Pulso…')
  const gyms = (await listPulsoGroups()).flatMap((group) => group.gyms)
  let firstGymId = ''
  for (const [index, draft] of drafts.entries()) {
    const gym = gyms.find((item) => item.tenantId === tenantIds[index])
    if (!gym) throw new Error('El gimnasio no apareció en Pulso.')
    firstGymId ||= gym.id
    await setUpGym(gym, draft, systemId, onStep)
  }
  return firstGymId
}

async function setUpGym(gym: Gym, draft: DraftCompany, systemId: string, onStep: CreationStep): Promise<void> {
  const name = draft.tradeName.trim()
  const branches = draft.branches.map((branch) => branch.name.trim()).filter(Boolean)
  onStep(`Creando las sedes de ${name}…`)
  const [main, ...others] = branches
  const current = gym.branches[0]
  if (main && current && current.name !== main) await updateBranch(current.id, { name: main, address: current.address })
  for (const branch of others) await createBranch(gym.id, { name: branch, address: '' })

  if (draft.modules.length) {
    onStep(`Encendiendo los módulos de ${name}…`)
    await updateGymFeatures(gym.id, draft.modules)
  }

  if (draft.admin) {
    onStep(`Dando acceso al administrador de ${name}…`)
    // An existing account is found again by its document number; a new one is created with it.
    await addMember({
      systemId,
      tenantId: gym.tenantId,
      documentType: draft.admin.documentType,
      documentNumber: draft.admin.documentNumber,
      fullName: draft.admin.fullName.trim(),
      role: 'admin',
    })
  }
}
