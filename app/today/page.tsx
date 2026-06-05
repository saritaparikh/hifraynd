import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  getTodayData,
  type DeliveryItem,
  type PersonTodayCard,
} from '@/lib/services/today'
import { formatDate } from '@/lib/constants/person'

function daysOverdue(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day).getTime()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor((today.getTime() - date) / 86_400_000)
}

function DeliveryRow({
  delivery,
  todayStr,
}: {
  delivery: DeliveryItem
  todayStr: string
}) {
  const owe = delivery.direction === 'to_them'
  const isOverdue =
    delivery.due_date !== null && delivery.due_date < todayStr

  let rightText: string
  let rightColor: string
  if (isOverdue) {
    rightText = `${daysOverdue(delivery.due_date!)} days overdue`
    rightColor = 'var(--red-500)'
  } else if (delivery.due_date) {
    rightText = formatDate(delivery.due_date) ?? ''
    rightColor = 'var(--fg-2)'
  } else {
    rightText = 'No due date'
    rightColor = 'var(--fg-3)'
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span
          className="shrink-0"
          style={{
            background: owe ? 'var(--ochre-100)' : 'var(--green-50)',
            color: owe ? 'var(--ochre-700)' : 'var(--green-600)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-medium)',
            padding: '2px var(--space-2)',
            whiteSpace: 'nowrap',
          }}
        >
          {owe ? 'I owe' : 'They owe'}
        </span>
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-1)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {delivery.description}
        </span>
      </div>
      <span
        className="shrink-0"
        style={{
          fontSize: 'var(--text-xs)',
          color: rightColor,
          whiteSpace: 'nowrap',
        }}
      >
        {rightText}
      </span>
    </div>
  )
}

function ReachOutRow({ date, todayStr }: { date: string; todayStr: string }) {
  const past = date < todayStr
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        style={{
          fontSize: 'var(--text-xs)',
          color: past ? 'var(--red-500)' : 'var(--fg-3)',
          whiteSpace: 'nowrap',
        }}
      >
        {past
          ? `Reach out · ${daysOverdue(date)} days overdue`
          : `Reach out · ${formatDate(date)}`}
      </span>
    </div>
  )
}

function TodayCard({
  person,
  todayStr,
}: {
  person: PersonTodayCard
  todayStr: string
}) {
  const hasDeliveries = person.deliveries.length > 0
  const hasReachOut = person.next_reach_out_date !== null

  return (
    <article
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-3)',
      }}
    >
      <Link
        href={`/contacts/${person.id}`}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--fw-semi)',
          color: 'var(--fg-1)',
          textDecoration: 'none',
        }}
      >
        {person.first_name} {person.last_name}
      </Link>

      {hasDeliveries && (
        <div
          className="flex flex-col"
          style={{ marginTop: 'var(--space-2)', gap: 'var(--space-2)' }}
        >
          {person.deliveries.map((d) => (
            <DeliveryRow key={d.id} delivery={d} todayStr={todayStr} />
          ))}
        </div>
      )}

      {hasReachOut && (
        <div
          style={{
            marginTop: 'var(--space-3)',
            paddingTop: hasDeliveries ? 'var(--space-3)' : 0,
            borderTop: hasDeliveries ? '1px solid var(--border-soft)' : 'none',
          }}
        >
          <ReachOutRow date={person.next_reach_out_date!} todayStr={todayStr} />
        </div>
      )}
    </article>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginTop: 'var(--space-7)', maxWidth: '640px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--fw-semi)',
          color: 'var(--fg-1)',
          letterSpacing: 'var(--tracking-tight)',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div
        className="flex flex-col"
        style={{ gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}
      >
        {children}
      </div>
    </section>
  )
}

export default async function TodayPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const data = await getTodayData(user!.id)
  const todayStr = new Date().toISOString().split('T')[0]

  const allEmpty =
    data.urgent.length === 0 &&
    data.this_week.length === 0 &&
    data.no_date.length === 0

  return (
    <main
      style={{
        background: 'var(--bg-page)',
        padding: 'var(--space-7)',
        minHeight: '100vh',
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: '640px' }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--fw-semi)',
            color: 'var(--fg-1)',
            letterSpacing: 'var(--tracking-tight)',
            lineHeight: 'var(--lh-tight)',
            margin: 0,
          }}
        >
          Today
        </h1>
        <Link
          href="/contacts"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}
        >
          Contacts
        </Link>
      </div>

      {allEmpty ? (
        <p
          style={{
            marginTop: 'var(--space-9)',
            textAlign: 'center',
            fontSize: 'var(--text-base)',
            color: 'var(--fg-2)',
          }}
        >
          {"You're all caught up."}
        </p>
      ) : (
        <>
          {data.urgent.length > 0 && (
            <Section title="Urgent">
              {data.urgent.map((person) => (
                <TodayCard key={person.id} person={person} todayStr={todayStr} />
              ))}
            </Section>
          )}
          {data.this_week.length > 0 && (
            <Section title="This week">
              {data.this_week.map((person) => (
                <TodayCard key={person.id} person={person} todayStr={todayStr} />
              ))}
            </Section>
          )}
          {data.no_date.length > 0 && (
            <Section title="No date">
              {data.no_date.map((person) => (
                <TodayCard key={person.id} person={person} todayStr={todayStr} />
              ))}
            </Section>
          )}
        </>
      )}
    </main>
  )
}
