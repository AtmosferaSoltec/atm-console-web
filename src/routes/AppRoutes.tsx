import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ComingSoon } from '@/components/common/ComingSoon'
import { NAV_GROUPS } from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PrivateRoute } from '@/routes/PrivateRoute'
import { FilesPage } from '@/pages/FilesPage'
import { GeneratedDocumentsPage } from '@/pages/GeneratedDocumentsPage'
import { IdentityRecordsPage } from '@/pages/IdentityRecordsPage'
import { IdentitySystemsPage } from '@/pages/IdentitySystemsPage'
import { IdentityUsagePage } from '@/pages/IdentityUsagePage'
import { LoginPage } from '@/pages/LoginPage'
import { StorageOverviewPage } from '@/pages/StorageOverviewPage'
import { TemplatesPage } from '@/pages/TemplatesPage'
import { ApiClientsPage } from '@/pages/ApiClientsPage'
import { CompaniesPage } from '@/pages/CompaniesPage'
import { CompanyDetailPage } from '@/pages/CompanyDetailPage'
import { CompanyNewPage } from '@/pages/CompanyNewPage'
import { InvoiceDetailPage } from '@/pages/InvoiceDetailPage'
import { InvoicesPage } from '@/pages/InvoicesPage'
import { MessagesPage } from '@/pages/MessagesPage'
import { SessionsPage } from '@/pages/SessionsPage'
import { ShippingGuideDetailPage } from '@/pages/ShippingGuideDetailPage'
import { ShippingGuidesPage } from '@/pages/ShippingGuidesPage'
import { UsagePage } from '@/pages/UsagePage'
import { SystemDetailPage } from '@/pages/SystemDetailPage'
import { SystemsPage } from '@/pages/SystemsPage'
import { TenantsPage } from '@/pages/TenantsPage'
import { UserDetailPage } from '@/pages/UserDetailPage'
import { UsersPage } from '@/pages/UsersPage'

function PlaceholderPage() {
  const { pathname } = useLocation()
  const item = NAV_GROUPS.flatMap((group) => group.items).find((navItem) => navItem.to === pathname)
  return <ComingSoon title={item?.label ?? 'Sección'} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
      <Route path={ROUTES.login} element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.auth.systems} element={<SystemsPage />} />
          <Route path={ROUTES.auth.systemDetail} element={<SystemDetailPage />} />
          <Route path={ROUTES.auth.tenants} element={<TenantsPage />} />
          <Route path={ROUTES.auth.users} element={<UsersPage />} />
          <Route path={ROUTES.auth.userDetail} element={<UserDetailPage />} />
          <Route path={ROUTES.messaging.sessions} element={<SessionsPage />} />
          <Route path={ROUTES.messaging.apiClients} element={<ApiClientsPage />} />
          <Route path={ROUTES.messaging.messages} element={<MessagesPage />} />
          <Route path={ROUTES.billing.companies} element={<CompaniesPage />} />
          <Route path={ROUTES.billing.companyNew} element={<CompanyNewPage />} />
          <Route path={ROUTES.billing.companyDetail} element={<CompanyDetailPage />} />
          <Route path={ROUTES.billing.invoices} element={<InvoicesPage />} />
          <Route path={ROUTES.billing.invoiceDetail} element={<InvoiceDetailPage />} />
          <Route path={ROUTES.billing.shippingGuides} element={<ShippingGuidesPage />} />
          <Route path={ROUTES.billing.shippingGuideDetail} element={<ShippingGuideDetailPage />} />
          <Route path={ROUTES.billing.usage} element={<UsagePage />} />
          <Route path={ROUTES.identity.usage} element={<IdentityUsagePage />} />
          <Route path={ROUTES.identity.systems} element={<IdentitySystemsPage />} />
          <Route path={ROUTES.identity.records} element={<IdentityRecordsPage />} />
          <Route path={ROUTES.documents.templates} element={<TemplatesPage />} />
          <Route path={ROUTES.documents.generated} element={<GeneratedDocumentsPage />} />
          <Route path={ROUTES.storage.overview} element={<StorageOverviewPage />} />
          <Route path={ROUTES.storage.files} element={<FilesPage />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
