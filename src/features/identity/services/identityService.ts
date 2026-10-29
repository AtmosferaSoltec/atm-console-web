import type { CachedCompany, CachedPerson, IdentityClientSystem, ProviderUsage } from '../types/identity.types'

const USAGE: ProviderUsage = { usedThisMonth: 312, monthlyCap: 900, providerPlanLimit: 1000, cachedPersons: 1248, cachedCompanies: 386, cacheHitRate: 94 }

const CLIENT_SYSTEMS: IdentityClientSystem[] = [
  { id: 'cs1', code: 'hotel', name: 'Hotel system', isActive: true, lastUsedAt: 'hace 4 min', queriesThisMonth: 148 },
  { id: 'cs2', code: 'iris', name: 'Iris', isActive: true, lastUsedAt: 'hace 1 h', queriesThisMonth: 96 },
  { id: 'cs3', code: 'nova', name: 'Nova', isActive: true, lastUsedAt: 'hace 3 h', queriesThisMonth: 52 },
  { id: 'cs4', code: 'orbita', name: 'Orbita', isActive: true, lastUsedAt: 'ayer', queriesThisMonth: 16 },
  { id: 'cs5', code: 'postman-test', name: 'Pruebas manuales', isActive: false, lastUsedAt: 'hace 12 días', queriesThisMonth: 0 },
]

const PERSONS: CachedPerson[] = [
  { documentNumber: '45871236', firstNames: 'MARIA FERNANDA', paternalSurname: 'QUISPE', maternalSurname: 'HUAMAN', storedAt: '14 ene 2026' },
  { documentNumber: '70123456', firstNames: 'CARLOS ALBERTO', paternalSurname: 'ROJAS', maternalSurname: 'DIAZ', storedAt: '14 ene 2026' },
  { documentNumber: '41236587', firstNames: 'LUCIA', paternalSurname: 'PAREDES', maternalSurname: 'CAMPOS', storedAt: '02 feb 2026' },
  { documentNumber: '47852136', firstNames: 'ANA SOFIA', paternalSurname: 'TORRES', maternalSurname: 'RUIZ', storedAt: '18 feb 2026' },
  { documentNumber: '72589631', firstNames: 'PEDRO PABLO', paternalSurname: 'SALAZAR', maternalSurname: 'LEON', storedAt: '24 feb 2026' },
  { documentNumber: '43698521', firstNames: 'ROSA ELENA', paternalSurname: 'CHAVEZ', maternalSurname: 'ORTIZ', storedAt: '11 mar 2026' },
]

const COMPANIES: CachedCompany[] = [
  { documentNumber: '20601234567', legalName: 'OLYMPUS COURIER S.A.C.', tradeName: 'OLYMPUS COURIER', address: 'AV. JAVIER PRADO ESTE 1234 - SAN BORJA', storedAt: '14 ene 2026' },
  { documentNumber: '20609876543', legalName: 'LAVENDIMIA E.I.R.L.', tradeName: null, address: 'JR. DE LA UNION 455 - LIMA', storedAt: '14 ene 2026' },
  { documentNumber: '20555123987', legalName: 'HOTEL ATMOSFERA S.A.C.', tradeName: 'HOTEL ATMOSFERA', address: 'AV. LARCO 890 - MIRAFLORES', storedAt: '02 feb 2026' },
  { documentNumber: '20487654321', legalName: 'AGRO NORTE S.A.', tradeName: null, address: null, storedAt: '18 feb 2026' },
  { documentNumber: '20498765432', legalName: 'INVERSIONES PACIFICO S.A.C.', tradeName: 'PACIFICO INVERSIONES', address: 'CAL. LAS BEGONIAS 441 - SAN ISIDRO', storedAt: '22 mar 2026' },
]

/** Hardcoded sample data. Replace with real API calls when the console is wired up. */
export function getProviderUsage(): ProviderUsage {
  return USAGE
}

export function getIdentityClientSystems(): IdentityClientSystem[] {
  return CLIENT_SYSTEMS
}

export function getCachedPersons(): CachedPerson[] {
  return PERSONS
}

export function getCachedCompanies(): CachedCompany[] {
  return COMPANIES
}
