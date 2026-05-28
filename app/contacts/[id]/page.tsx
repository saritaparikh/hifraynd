import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPersonById } from '@/lib/data/persons'
import { getCompanyById } from '@/lib/data/companies'
import { getInteractionsByPerson } from '@/lib/data/interactions'
import type { Database } from '@/lib/types/database.types'

type Person = Database['public']['Tables']['persons']['Row']
type InteractionType = Database['public']['Enums']['interaction_type']

const INTERACTION_TYPE_LABEL: Record<InteractionType, string> = {
  in_person: 'In Person',
  call: 'Call',
  email: 'Email',
  other: 'Other',
}

const STATUS_LABEL: Record<Person['status'], string> = {
  active: 'Active',
  nurture: 'Nurture',
  dormant: 'Dormant',
  potential: 'Potential',
}

const STATUS_STYLE: Record<
  Person['status'],
  { bg: string; color: string; border: string }
> = {
  active: { bg: 'var(--green-50)', color: 'var(--green-600)', border: 'var(--green-300)' },
  nurture: { bg: 'var(--gold-300)', color: 'var(--cocoa-700)', border: 'var(--gold-500)' },
  dormant: { bg: 'var(--cream-3)', color: 'var(--fg-2)', border: 'var(--sand)' },
  potential: { bg: 'var(--ochre-50)', color: 'var(--ochre-700)', border: 'var(--ochre-300)' },
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatInteractionDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--fg-2)',
          marginBottom: 'var(--space-1)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 'var(--text-base)',
          color: 'var(--fg-1)',
          lineHeight: 'var(--lh-relaxed)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const person = await getPersonById(id, user!.id)
  if (!person) notFound()

  const company = person.company_id
    ? await getCompanyById(person.company_id, user!.id)
    : null
  const companyName = company?.name ?? null

  const interactions = await getInteractionsByPerson(person.id, user!.id)

  const status = STATUS_STYLE[person.status]
  const titleLine = [person.title, companyName].filter(Boolean).join(' · ')
  const nextReachOut = formatDate(person.next_reach_out_date)

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
        <Link
          href="/contacts"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}
        >
          ← Back to contacts
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/contacts/${person.id}/interactions/new`}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-medium)',
              background: 'var(--bg-subtle)',
              color: 'var(--fg-1)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            Log interaction
          </Link>
          <Link
            href={`/contacts/${person.id}/edit`}
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}
          >
            Edit
          </Link>
        </div>
      </div>

      <div
        className="flex items-center gap-3 flex-wrap"
        style={{ marginTop: 'var(--space-6)', maxWidth: '640px' }}
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
          {person.first_name} {person.last_name}
        </h1>
        <span
          style={{
            background: status.bg,
            color: status.color,
            border: `1px solid ${status.border}`,
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

      {titleLine && (
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--fg-2)',
            margin: 0,
            marginTop: 'var(--space-2)',
          }}
        >
          {titleLine}
        </p>
      )}

      <div
        className="flex flex-col"
        style={{
          gap: 'var(--space-5)',
          marginTop: 'var(--space-7)',
          maxWidth: '640px',
        }}
      >
        {person.email && <Field label="Email">{person.email}</Field>}
        {person.location && <Field label="Location">{person.location}</Field>}
        {person.how_we_met && (
          <Field label="How we met">{person.how_we_met}</Field>
        )}
        {person.what_i_can_do_for_them && (
          <Field label="What I can do for them">
            {person.what_i_can_do_for_them}
          </Field>
        )}
        {person.personal_notes && (
          <Field label="Personal notes">{person.personal_notes}</Field>
        )}
        {person.professional_notes && (
          <Field label="Professional notes">{person.professional_notes}</Field>
        )}
        {nextReachOut && (
          <Field label="Next reach out">{nextReachOut}</Field>
        )}
        {person.cadence_days && (
          <Field label="Cadence">Every {person.cadence_days} days</Field>
        )}
      </div>

      <section style={{ marginTop: 'var(--space-8)', maxWidth: '640px' }}>
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
          Interactions
        </h2>

        {interactions.length === 0 ? (
          <p
            style={{
              marginTop: 'var(--space-4)',
              fontSize: 'var(--text-base)',
              color: 'var(--fg-2)',
            }}
          >
            No interactions yet
          </p>
        ) : (
          <div
            className="flex flex-col"
            style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}
          >
            {interactions.map((interaction) => (
              <article
                key={interaction.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: 'var(--space-4)',
                }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}>
                    {formatInteractionDate(interaction.interaction_date)}
                  </span>
                  <span
                    style={{
                      background: 'var(--bg-subtle)',
                      color: 'var(--fg-2)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--fw-medium)',
                      padding: '2px var(--space-2)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {INTERACTION_TYPE_LABEL[interaction.type]}
                  </span>
                </div>

                {interaction.title && (
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--fw-semi)',
                      color: 'var(--fg-1)',
                      marginTop: 'var(--space-2)',
                    }}
                  >
                    {interaction.title}
                  </div>
                )}

                {interaction.notes && (
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--fg-2)',
                      lineHeight: 'var(--lh-relaxed)',
                      margin: 0,
                      marginTop: 'var(--space-2)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {interaction.notes}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
