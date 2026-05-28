import Link from 'next/link'
import type { Database } from '@/lib/types/database.types'

type Person = Database['public']['Tables']['persons']['Row']

interface PersonCardProps {
  person: Person
  companyName?: string
  lastContactDate?: Date
}

const RING_R = 24
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R

function computeRingP(lastContactDate: Date | undefined, cadenceDays: number | null): number | null {
  if (!cadenceDays || !lastContactDate) return null
  const daysSince = Math.floor((Date.now() - lastContactDate.getTime()) / 86_400_000)
  return Math.max(0, 1 - daysSince / cadenceDays)
}

function ringColor(ringP: number): string {
  if (ringP >= 0.5) return 'var(--green-500)'
  if (ringP >= 0.2) return 'var(--gold-500)'
  return 'var(--red-500)'
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  // Parse as local date to avoid UTC-shift artifacts
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const STATUS_LABEL: Record<Person['status'], string> = {
  active:    'Active',
  nurture:   'Nurture',
  dormant:   'Dormant',
  potential: 'Potential',
}

const STATUS_STYLE: Record<Person['status'], { bg: string; color: string; border: string }> = {
  active:    { bg: 'var(--green-50)',  color: 'var(--green-600)', border: 'var(--green-300)' },
  nurture:   { bg: 'var(--gold-300)', color: 'var(--cocoa-700)', border: 'var(--gold-500)' },
  dormant:   { bg: 'var(--cream-3)',  color: 'var(--fg-2)',      border: 'var(--sand)' },
  potential: { bg: 'var(--ochre-50)', color: 'var(--ochre-700)', border: 'var(--ochre-300)' },
}

export default function PersonCard({ person, companyName, lastContactDate }: PersonCardProps) {
  const ringP = computeRingP(lastContactDate, person.cadence_days)
  const dashOffset = ringP !== null ? RING_CIRCUMFERENCE * (1 - ringP) : 0
  const initials = [person.first_name[0], person.last_name[0]]
  .filter(Boolean)
  .join('')
  .toUpperCase() || '?'
  const nextReachOut = formatDate(person.next_reach_out_date)
  const { bg, color, border } = STATUS_STYLE[person.status]

  return (
    <Link
      href={`/contacts/${person.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
    <article
      className="flex items-center gap-4"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-4)',
      }}
    >
      {/* Cadence ring */}
      <div className="shrink-0">
        <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
          {/* Track */}
          <circle
            cx="28" cy="28" r={RING_R}
            fill="none"
            stroke="var(--sand)"
            strokeWidth="4"
          />
          {/* Progress arc — omitted when no cadence or no lastContactDate */}
          {ringP !== null && (
            <circle
              cx="28" cy="28" r={RING_R}
              fill="none"
              stroke={ringColor(ringP)}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 28 28)"
            />
          )}
          {/* Initials */}
          <text
            x="28" y="28"
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--fw-semi)',
              fill: 'var(--fg-2)',
            }}
          >
            {initials}
          </text>
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--fw-semi)',
              color: 'var(--fg-1)',
              lineHeight: 'var(--lh-snug)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {person.first_name} {person.last_name}
          </span>

          {/* Status badge */}
          <span
            className="shrink-0"
            style={{
              background: bg,
              color,
              border: `1px solid ${border}`,
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--fw-medium)',
              padding: '2px var(--space-2)',
              whiteSpace: 'nowrap',
            }}
          >
            {STATUS_LABEL[person.status]}
          </span>
        </div>

        {(person.title || companyName) && (
          <p
            className="truncate"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-2)',
              margin: 0,
              marginTop: 'var(--space-1)',
            }}
          >
            {[person.title, companyName].filter(Boolean).join(' · ')}
          </p>
        )}

        {(nextReachOut || person.cadence_days) && (
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{ marginTop: 'var(--space-2)' }}
          >
            {nextReachOut && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>
                Reach out {nextReachOut}
              </span>
            )}
            {person.cadence_days && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>
                Every {person.cadence_days}d
              </span>
            )}
          </div>
        )}
      </div>
    </article>
    </Link>
  )
}
