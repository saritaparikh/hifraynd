import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { unarchiveContact } from '../[id]/archive/actions'

export default async function ArchivedContactsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('persons')
    .select('id, first_name, last_name, status, title')
    .eq('user_id', user!.id)
    .eq('archived', true)
    .order('last_name', { ascending: true })

  if (error) throw new Error(`Failed to fetch archived contacts: ${error.message}`)

  const persons = data ?? []

  return (
    <main
      style={{
        background: 'var(--bg-page)',
        padding: 'var(--space-7)',
        minHeight: '100vh',
      }}
    >
      <Link
        href="/contacts"
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--fg-2)',
          textDecoration: 'none',
        }}
      >
        ← Back to contacts
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--fw-semi)',
          color: 'var(--fg-1)',
          letterSpacing: 'var(--tracking-tight)',
          lineHeight: 'var(--lh-tight)',
          margin: 'var(--space-4) 0 var(--space-7)',
        }}
      >
        Archived contacts
      </h1>

      {persons.length === 0 ? (
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--fg-2)',
          }}
        >
          No archived contacts.
        </p>
      ) : (
        <div
          className="flex flex-col"
          style={{ gap: 'var(--space-3)', maxWidth: '640px' }}
        >
          {persons.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between gap-3"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: 'var(--space-3)',
              }}
            >
              <div className="min-w-0">
                <div
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--fw-medium)',
                    color: 'var(--fg-1)',
                  }}
                >
                  {person.first_name} {person.last_name}
                </div>
                {person.title && (
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--fg-2)',
                      marginTop: 'var(--space-1)',
                    }}
                  >
                    {person.title}
                  </div>
                )}
              </div>

              <form action={unarchiveContact} className="shrink-0">
                <input type="hidden" name="person_id" value={person.id} />
                <button
                  type="submit"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Restore
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
