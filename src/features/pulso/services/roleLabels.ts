const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  receptionist: 'Recepción',
}

/** The Spanish name of a Pulso role; unknown roles are shown as they come. */
export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role
}
