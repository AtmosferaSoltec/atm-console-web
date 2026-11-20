/**
 * The Pulso administration: clients, their companies (gyms), branches, modules and administrators. It reads and
 * writes auth-api (clients, companies, people) and pulso-api (gyms, branches, modules, suspension).
 */
export { AddCompanyDialog } from './components/AddCompanyDialog'
export { BranchesTab } from './components/BranchesTab'
export { CompanyAvatar } from './components/CompanyAvatar'
export { ClientCard } from './components/ClientCard'
export { GeneralTab } from './components/GeneralTab'
export { GymPreview } from './components/GymPreview'
export { LoadState } from './components/LoadState'
export { ModuleCatalog } from './components/ModuleCatalog'
export { ModulesTab } from './components/ModulesTab'
export { NewClientWizard } from './components/NewClientWizard'
export { ProductCategoriesTab } from './components/ProductCategoriesTab'
export { companyHasModule } from './services/moduleCatalog'
export { TeamTab } from './components/TeamTab'
export { useCompanyDetail, usePulsoAdmin } from './hooks/usePulsoSetup'
export type { ClientSummary, Company } from './types/pulsoSetup.types'
