import { DOCUMENTS_API_BASE_URL } from '@/config/env'
import { request } from '@/services/httpClient'
import type { ActivityResponse, RenderActivity } from '../types/activity.types'

export async function getRenderActivity(signal?: AbortSignal): Promise<RenderActivity> {
  const activity = await request<ActivityResponse>('/v1/admin/activity', { baseUrl: DOCUMENTS_API_BASE_URL, signal })
  return {
    since: new Date(activity.since),
    totals: activity.totals,
    avgDurationMs: activity.avg_duration_ms,
    bySystem: activity.by_system,
    byFormat: activity.by_format,
    recent: activity.recent.map((event) => ({
      at: new Date(event.at),
      system: event.system,
      template: event.template,
      format: event.format,
      items: event.items,
      bytes: event.bytes,
      durationMs: event.duration_ms,
      outcome: event.outcome,
    })),
  }
}
