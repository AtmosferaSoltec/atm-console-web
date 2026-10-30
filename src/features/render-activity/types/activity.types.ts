export type ActivityOutcome = 'ok' | 'invalid' | 'busy' | 'error'

/** Raw bodies of the documents API (snake_case). */
export interface ActivityEventResponse {
  at: string
  system: string
  template: string
  format: string
  items: number
  bytes: number
  duration_ms: number
  outcome: ActivityOutcome
}

export interface BreakdownResponse {
  name: string
  ok: number
  failed: number
}

export interface ActivityResponse {
  since: string
  totals: Record<ActivityOutcome, number>
  avg_duration_ms: number
  by_system: BreakdownResponse[]
  by_format: BreakdownResponse[]
  recent: ActivityEventResponse[]
}

/** What the console works with. */
export interface ActivityEvent {
  at: Date
  system: string
  template: string
  format: string
  items: number
  bytes: number
  durationMs: number
  outcome: ActivityOutcome
}

export interface Breakdown {
  name: string
  ok: number
  failed: number
}

export interface RenderActivity {
  since: Date
  totals: Record<ActivityOutcome, number>
  avgDurationMs: number
  bySystem: Breakdown[]
  byFormat: Breakdown[]
  recent: ActivityEvent[]
}

export interface RecentTableProps {
  events: ActivityEvent[]
  /** Names by auth system code. */
  systemNames: Record<string, string>
  emptyMessage: string
}

export interface BreakdownTableProps {
  rows: Breakdown[]
  /** Heading of the first column. */
  nameLabel: string
  /** Shows the label for a row name; defaults to the name itself. */
  labelFor: (name: string) => string
  emptyMessage: string
}
