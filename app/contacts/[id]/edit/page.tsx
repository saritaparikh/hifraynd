import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPersonById } from '@/lib/data/persons'
import { updateContact } from './actions'

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

export default async function EditContactPage({
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
        Edit {person.first_name} {person.last_name}
      </h1>

      <form
        action={updateContact}
        className="flex flex-col"
        style={{ gap: 'var(--space-5)', maxWidth: '480px' }}
      >
        <input type="hidden" name="person_id" value={person.id} />

        <div>
          <label htmlFor="first_name" style={labelStyle}>
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            defaultValue={person.first_name}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="last_name" style={labelStyle}>
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            defaultValue={person.last_name}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={person.email ?? ''}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="title" style={labelStyle}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={person.title ?? ''}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="status" style={labelStyle}>
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={person.status}
            style={fieldStyle}
          >
            <option value="potential">Potential</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="nurture">Nurture</option>
            <option value="dormant">Dormant</option>
          </select>
        </div>

        <div>
          <label htmlFor="cadence_days" style={labelStyle}>
            Cadence (days)
          </label>
          <input
            id="cadence_days"
            name="cadence_days"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            defaultValue={person.cadence_days ?? ''}
            style={fieldStyle}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <label htmlFor="next_reach_out_date" style={{ ...labelStyle, marginBottom: 0 }}>
              Next reach out date
            </label>
            <span
              title="Optional. Set this to override the automatic cadence calculation. Leave blank to let the cadence determine when to reach out."
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
          <input
            id="next_reach_out_date"
            name="next_reach_out_date"
            type="date"
            defaultValue={person.next_reach_out_date ?? ''}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="how_we_met" style={labelStyle}>
            How we met
          </label>
          <textarea
            id="how_we_met"
            name="how_we_met"
            rows={3}
            defaultValue={person.how_we_met ?? ''}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="what_i_can_do_for_them" style={labelStyle}>
            What I can do for them
          </label>
          <textarea
            id="what_i_can_do_for_them"
            name="what_i_can_do_for_them"
            rows={3}
            defaultValue={person.what_i_can_do_for_them ?? ''}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="personal_notes" style={labelStyle}>
            Personal notes
          </label>
          <textarea
            id="personal_notes"
            name="personal_notes"
            rows={4}
            defaultValue={person.personal_notes ?? ''}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="professional_notes" style={labelStyle}>
            Professional notes
          </label>
          <textarea
            id="professional_notes"
            name="professional_notes"
            rows={4}
            defaultValue={person.professional_notes ?? ''}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
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
          Save changes
        </button>
      </form>
    </main>
  )
}
