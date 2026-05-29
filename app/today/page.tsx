import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getTodayData } from '@/lib/services/today'
import { formatDate } from '@/lib/constants/person'

const rowStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-soft)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-sm)',
  padding: 'var(--space-3)',
}

function daysOverdue(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day).getTime()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor((today.getTime() - date) / 86_400_000)
}

function fullName(first?: string | null, last?: string | null): string {
  return [first, last].filter(Boolean).join(' ')
}

function Section({
  title,
  titleColor,
  children,
}: {
  title: string
  titleColor?: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginTop: 'var(--space-7)', maxWidth: '640px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--fw-semi)',
          color: titleColor ?? 'var(--fg-1)',
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

function PersonLink({ id, name }: { id: string; name: string }) {
  return (
    <Link
      href={`/contacts/${id}`}
      style={{
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-medium)',
        color: 'var(--fg-1)',
        textDecoration: 'none',
      }}
    >
      {name}
    </Link>
  )
}

const descriptionStyle = {
  fontSize: 'var(--text-sm)',
  color: 'var(--fg-2)',
  marginTop: 'var(--space-1)',
  whiteSpace: 'pre-wrap' as const,
}

export default async function TodayPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { overdueOwed, upcomingOwed, theyOwe, reachOut } = await getTodayData(
    user!.id
  )
  const todayStr = new Date().toISOString().split('T')[0]

  const allEmpty =
    overdueOwed.length === 0 &&
    upcomingOwed.length === 0 &&
    theyOwe.length === 0 &&
    reachOut.length === 0

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
          {overdueOwed.length > 0 && (
            <Section title="Overdue — I owe" titleColor="var(--red-500)">
              {overdueOwed.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3"
                  style={rowStyle}
                >
                  <div className="min-w-0">
                    <PersonLink
                      id={d.person_id}
                      name={fullName(d.persons?.first_name, d.persons?.last_name)}
                    />
                    <div style={descriptionStyle}>{d.description}</div>
                  </div>
                  <span
                    className="shrink-0"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--red-500)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {daysOverdue(d.due_date!)} days overdue
                  </span>
                </div>
              ))}
            </Section>
          )}

          {upcomingOwed.length > 0 && (
            <Section title="I owe them">
              {upcomingOwed.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3"
                  style={rowStyle}
                >
                  <div className="min-w-0">
                    <PersonLink
                      id={d.person_id}
                      name={fullName(d.persons?.first_name, d.persons?.last_name)}
                    />
                    <div style={descriptionStyle}>{d.description}</div>
                  </div>
                  <span
                    className="shrink-0"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: d.due_date ? 'var(--fg-2)' : 'var(--fg-3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.due_date ? formatDate(d.due_date) : 'No due date'}
                  </span>
                </div>
              ))}
            </Section>
          )}

          {theyOwe.length > 0 && (
            <Section title="They owe me">
              {theyOwe.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3"
                  style={rowStyle}
                >
                  <div className="min-w-0">
                    <PersonLink
                      id={d.person_id}
                      name={fullName(d.persons?.first_name, d.persons?.last_name)}
                    />
                    <div style={descriptionStyle}>{d.description}</div>
                  </div>
                  <span
                    className="shrink-0"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: d.due_date ? 'var(--fg-2)' : 'var(--fg-3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.due_date ? formatDate(d.due_date) : 'No due date'}
                  </span>
                </div>
              ))}
            </Section>
          )}

          {reachOut.length > 0 && (
            <Section title="Reach out">
              {reachOut.map((person) => {
                const due =
                  person.next_reach_out_date !== null &&
                  person.next_reach_out_date <= todayStr
                return (
                  <div
                    key={person.id}
                    className="flex items-center justify-between gap-3"
                    style={rowStyle}
                  >
                    <PersonLink
                      id={person.id}
                      name={fullName(person.first_name, person.last_name)}
                    />
                    {person.next_reach_out_date ? (
                      <span
                        className="shrink-0"
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: due ? 'var(--red-500)' : 'var(--fg-2)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatDate(person.next_reach_out_date)}
                      </span>
                    ) : (
                      <span
                        className="shrink-0"
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--fg-3)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        No date set
                      </span>
                    )}
                  </div>
                )
              })}
            </Section>
          )}
        </>
      )}
    </main>
  )
}
