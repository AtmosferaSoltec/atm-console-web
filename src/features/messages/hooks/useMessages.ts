import { getMessages } from '../services/messageService'
import type { MessageFiltersValue, MessagesPageResult } from '../types/message.types'

export function useMessages(filters: MessageFiltersValue, page: number, pageSize: number): MessagesPageResult {
  return getMessages(filters, page, pageSize)
}
