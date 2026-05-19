import { createClient } from '@/lib/supabase/server'
import { getPersonsWithContext } from '@/lib/services/network'
import PersonCard from '@/components/PersonCard'

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
          {persons.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              companyName={person.companies?.name ?? undefined}
            />
          ))}
        </div>
      )}
    </main>
  )
}
