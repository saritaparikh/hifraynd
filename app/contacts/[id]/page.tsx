import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPersonById } from '@/lib/data/persons'
import { getCompanyById } from '@/lib/data/companies'
import { getInteractionsByPerson } from '@/lib/data/interactions'
import { getDeliveriesByPerson } from '@/lib/data/deliveries'
import {
  STATUS_LABEL,
  STATUS_STYLE,
  INTERACTION_TYPE_LABEL,
  formatDate,
} from '@/lib/constants/person'
import { markDeliveryDone, reopenDelivery } from './deliveries/actions'
import { archiveContact } from './archive/actions'

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

  const [company, interactions, deliveries] = await Promise.all([
    person.company_id
      ? getCompanyById(person.company_id, user!.id)
      : Promise.resolve(null),
    getInteractionsByPerson(person.id, user!.id),
    getDeliveriesByPerson(person.id, user!.id),
  ])
  const companyName = company?.name ?? null
  deliveries.sort((a, b) => Number(a.completed) - Number(b.completed))

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
        <div className="flex items-center gap-4">
          <Link
            href="/today"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-2)',
              textDecoration: 'none',
            }}
          >
            ← Today
          </Link>
          <Link
            href="/contacts"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-2)',
              textDecoration: 'none',
            }}
          >
            Contacts
          </Link>
        </div>
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
            href={`/contacts/${person.id}/deliveries/new`}
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
            Add delivery
          </Link>
          <Link
            href={`/contacts/${person.id}/edit`}
            style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}
          >
            Edit
          </Link>
          <form action={archiveContact}>
            <input type="hidden" name="person_id" value={person.id} />
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-body)',
                color: 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              Archive
            </button>
          </form>
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

      {deliveries.length > 0 && (
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
            Deliveries
          </h2>

          <div
            className="flex flex-col"
            style={{ gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}
          >
            {deliveries.map((delivery) => {
              const owe = delivery.direction === 'to_them'
              const dueDate = formatDate(delivery.due_date)

              return (
                <article
                  key={delivery.id}
                  className="flex items-start justify-between gap-3"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: 'var(--space-4)',
                    opacity: delivery.completed ? 0.5 : undefined,
                  }}
                >
                  <div className="min-w-0">
                    <span
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

                    <div
                      style={{
                        fontSize: 'var(--text-base)',
                        color: 'var(--fg-1)',
                        marginTop: 'var(--space-2)',
                        whiteSpace: 'pre-wrap',
                        textDecoration: delivery.completed
                          ? 'line-through'
                          : undefined,
                      }}
                    >
                      {delivery.description}
                    </div>

                    {dueDate && (
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--fg-3)',
                          marginTop: 'var(--space-1)',
                        }}
                      >
                        Due {dueDate}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/contacts/${person.id}/deliveries/${delivery.id}/edit`}
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--fg-2)',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Edit
                    </Link>
                    {delivery.completed ? (
                      <>
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--green-500)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Done ✓
                        </span>
                        <form action={reopenDelivery}>
                          <input type="hidden" name="delivery_id" value={delivery.id} />
                          <input type="hidden" name="person_id" value={person.id} />
                          <button
                            type="submit"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              fontSize: 'var(--text-xs)',
                              fontFamily: 'var(--font-body)',
                              color: 'var(--fg-2)',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Re-open
                          </button>
                        </form>
                      </>
                    ) : (
                      <form action={markDeliveryDone}>
                        <input type="hidden" name="delivery_id" value={delivery.id} />
                        <input type="hidden" name="person_id" value={person.id} />
                        <button
                          type="submit"
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontSize: 'var(--text-xs)',
                            fontFamily: 'var(--font-body)',
                            color: 'var(--fg-2)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Mark done
                        </button>
                      </form>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

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
