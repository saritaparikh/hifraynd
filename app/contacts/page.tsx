import { createClient } from '@/lib/supabase/server'
import { getPersonsWithContext } from '@/lib/services/network'
import PersonCard from '@/components/PersonCard'
import Link from 'next/link'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const persons = await getPersonsWithContext(user!.id)

  return (
    <main
      style={{
        background: 'var(--bg-page)',
        padding: 'var(--space-7)',
        minHeight: '100vh',
      }}
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
        Contacts
      </h1>
<Link
  href="/contacts/new"
  style={{
    display: 'inline-block',
    marginTop: 'var(--space-4)',
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
      {persons.length === 0 ? (
        <p
          style={{
            marginTop: 'var(--space-7)',
            fontSize: 'var(--text-base)',
            color: 'var(--fg-2)',
          }}
        >
          No contacts yet. Add someone to get started.
        </p>
      ) : (
        <div
          className="flex flex-col"
          style={{ gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}
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