import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPersonById } from '@/lib/data/persons'
import { createInteraction } from './actions'

const labelStyle = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--fw-medium)',
  color: 'var(--fg-2)',
  marginBottom: 'var(--space-2)',
}

const fieldStyle = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  fontSize: 'var(--text-base)',
  fontFamily: 'var(--font-body)',
  color: 'var(--fg-1)',
  background: 'var(--bg-card)',
  border: '1.5px solid var(--border-soft)',
  borderRadius: 'var(--radius-sm)',
}

function todayLocal(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export default async function NewInteractionPage({
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

  return (
    <main
      style={{
        background: 'var(--bg-page)',
        padding: 'var(--space-7)',
        minHeight: '100vh',
      }}
    >
      <Link
        href={`/contacts/${id}`}
        style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}
      >
        ← Back to {person.first_name}
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
        Log interaction with {person.first_name}
      </h1>

      <form
        action={createInteraction}
        className="flex flex-col"
        style={{ gap: 'var(--space-5)', maxWidth: '480px' }}
      >
        <input type="hidden" name="person_id" value={person.id} />

        <div>
          <label htmlFor="interaction_date" style={labelStyle}>
            Date
          </label>
          <input
            id="interaction_date"
            name="interaction_date"
            type="date"
            required
            defaultValue={todayLocal()}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="type" style={labelStyle}>
            Type
          </label>
          <select id="type" name="type" required style={fieldStyle}>
            <option value="in_person">In Person</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" style={labelStyle}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="notes" style={labelStyle}>
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={5}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <input
            id="resets_cadence"
            name="resets_cadence"
            type="checkbox"
            defaultChecked
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label
            htmlFor="resets_cadence"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-1)',
              cursor: 'pointer',
            }}
          >
            Resets cadence
          </label>
          <span
            title="Check this if the interaction counts as a professional touchpoint. Uncheck for personal gestures like birthdays or congratulations that shouldn't affect your reach-out schedule."
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-3)',
              cursor: 'help',
              borderBottom: '1px dotted var(--fg-3)',
            }}
          >
            ?
          </span>
        </div>

        <button
          type="submit"
          style={{
            marginTop: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-6)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--fw-semi)',
            fontFamily: 'var(--font-body)',
            color: 'var(--fg-on-primary)',
            background: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          Log interaction
        </button>
      </form>
    </main>
  )
}
