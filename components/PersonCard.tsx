import Link from 'next/link'
import { STATUS_LABEL, STATUS_STYLE, formatDate } from '@/lib/constants/person'
import PlantIndicator from '@/components/PlantIndicator'
import type { Database } from '@/lib/types/database.types'

type Person = Database['public']['Tables']['persons']['Row']

interface PersonCardProps {
  person: Person
  companyName?: string
  lastContactDate?: Date
}

export default function PersonCard({ person, companyName, lastContactDate }: PersonCardProps) {
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
      <div className="shrink-0">
        <PlantIndicator
          lastContactDate={lastContactDate}
          cadenceDays={person.cadence_days}
          nextReachOutDate={person.next_reach_out_date}
        />
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
