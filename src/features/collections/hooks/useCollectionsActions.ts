import { useAction } from '@/hooks/useAction'
import { createCollectionClient, createSubscription, registerPayment } from '../services/collectionsService'

const ERROR_MESSAGES: Record<string, string> = {
  invalid_input: 'Revisa los datos ingresados.',
  client_not_found: 'No se encontró el cliente.',
  charges_not_pending: 'Algunos cargos ya estaban pagados. Recarga la lista e intenta de nuevo.',
}

export function useCreateCollectionClient() {
  return useAction(createCollectionClient, 'No se pudo agregar el cliente. Intenta de nuevo.', ERROR_MESSAGES)
}

export function useCreateSubscription() {
  return useAction(createSubscription, 'No se pudo crear el cobro. Intenta de nuevo.', ERROR_MESSAGES)
}

export function useRegisterPayment() {
  return useAction(registerPayment, 'No se pudo registrar el pago. Intenta de nuevo.', ERROR_MESSAGES)
}
