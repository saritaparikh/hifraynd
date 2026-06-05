import { createClient } from '@/lib/supabase/server'
import { getPersonsWithContext } from '@/lib/services/network'
import PersonCard from '@/components/PersonCard'
import Link from 'next/link'
import { signOut } from './actions'
import { STATUS_LABEL } from '@/lib/constants/person'

const STATUS_FILTERS: Array<{ value: string | undefined; label: string }> = [
  { value: undefined, label: 'All' },
  { value: 'potential', label: STATUS_LABEL.potential },
  { value: 'planned', label: STATUS_LABEL.planned },
  { value: 'active', label: STATUS_LABEL.active },
  { value: 'nurture', label: STATUS_LABEL.nurture },
  { value: 'dormant', label: STATUS_LABEL.dormant },
]

function buildUrl(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value)
  })
  const qs = search.toString()
  return qs ? `?${qs}` : '/contacts'
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>
}) {
  const { status, sort } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const persons = await getPersonsWithContext(user!.id, { status, sort })

  return (
    <main
      style={{
        background: 'var(--bg-page)',
        padding: 'var(--space-7)',
        minHeight: '100vh',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
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
            Contacts
          </h1>
          <Link
            href="/today"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-2)',
              textDecoration: 'none',
            }}
          >
            Today
          </Link>
          <Link
            href="/contacts/archived"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-2)',
              textDecoration: 'none',
            }}
          >
            Archived
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/contacts/new"
            style={{
              display: 'inline-block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-semi)',
              color: 'var(--fg-on-primary)',
              background: 'var(--color-primary)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            + Add Contact
          </Link>
          <form action={signOut}>
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
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div
        className="flex items-center flex-wrap"
        style={{
          gap: 'var(--space-2)',
          marginTop: 'var(--space-5)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {STATUS_FILTERS.map((filter) => {
          const active = filter.value === status
          return (
            <Link
              key={filter.label}
              href={buildUrl({ status: filter.value, sort })}
              style={{
                background: active ? 'var(--color-primary)' : 'var(--bg-subtle)',
                color: active ? 'var(--fg-on-primary)' : 'var(--fg-2)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-medium)',
                padding: '4px var(--space-3)',
                textDecoration: 'none',
              }}
            >
              {filter.label}
            </Link>
          )
        })}

        <Link
          href={
            sort === 'reach_out'
              ? buildUrl({ status, sort: undefined })
              : buildUrl({ status, sort: 'reach_out' })
          }
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-medium)',
            color:
              sort === 'reach_out' ? 'var(--color-primary)' : 'var(--fg-2)',
            textDecoration: 'none',
            padding: '4px var(--space-2)',
          }}
        >
          {sort === 'reach_out' ? 'Sort: Reach out date' : 'Sort: Name'}
        </Link>
      </div>

      {persons.length === 0 ? (
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--fg-2)',
          }}
        >
          {status
            ? 'No contacts match this filter.'
            : 'No contacts yet. Add someone to get started.'}
        </p>
      ) : (
        <div
          className="flex flex-col"
          style={{ gap: 'var(--space-3)' }}
        >
          {persons.map((person) => {
            const lastContactDate = person.last_contact_date
              ? new Date(person.last_contact_date)
              : undefined

            return (
              <PersonCard
                key={person.id}
                person={person}
                companyName={person.companies?.name ?? undefined}
                lastContactDate={lastContactDate}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}
