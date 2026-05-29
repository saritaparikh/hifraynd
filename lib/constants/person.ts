import type { Database } from '@/lib/types/database.types'

type ContactStatus = Database['public']['Enums']['contact_status']
type InteractionType = Database['public']['Enums']['interaction_type']

export const STATUS_LABEL: Record<ContactStatus, string> = {
  active: 'Active',
  nurture: 'Nurture',
  dormant: 'Dormant',
  potential: 'Potential',
  planned: 'Planned',
}

export const STATUS_STYLE: Record<
  ContactStatus,
  { bg: string; color: string; border: string }
> = {
  active: { bg: 'var(--green-50)', color: 'var(--green-600)', border: 'var(--green-300)' },
  nurture: { bg: 'var(--gold-300)', color: 'var(--cocoa-700)', border: 'var(--gold-500)' },
  dormant: { bg: 'var(--cream-3)', color: 'var(--fg-2)', border: 'var(--sand)' },
  potential: { bg: 'var(--ochre-50)', color: 'var(--ochre-700)', border: 'var(--ochre-300)' },
  planned: { bg: 'var(--ochre-50)', color: 'var(--ochre-700)', border: 'var(--ochre-300)' },
}

export const INTERACTION_TYPE_LABEL: Record<InteractionType, string> = {
  in_person: 'In Person',
  call: 'Call',
  email: 'Email',
  other: 'Other',
}

export function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  // Parse as local date to avoid UTC-shift artifacts
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
