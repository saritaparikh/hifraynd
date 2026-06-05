import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPersonById } from '@/lib/data/persons'
import { getDeliveryById } from '@/lib/data/deliveries'
import { updateDelivery } from './actions'

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

export default async function EditDeliveryPage({
  params,
}: {
  params: Promise<{ id: string; deliveryId: string }>
}) {
  const { id, deliveryId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [person, delivery] = await Promise.all([
    getPersonById(id, user!.id),
    getDeliveryById(deliveryId, user!.id),
  ])

  if (!person || !delivery || delivery.person_id !== person.id) notFound()

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
        Edit delivery for {person.first_name}
      </h1>

      <form
        action={updateDelivery}
        className="flex flex-col"
        style={{ gap: 'var(--space-5)', maxWidth: '480px' }}
      >
        <input type="hidden" name="delivery_id" value={delivery.id} />
        <input type="hidden" name="person_id" value={person.id} />

        <div>
          <label htmlFor="direction" style={labelStyle}>
            Direction
          </label>
          <select
            id="direction"
            name="direction"
            required
            defaultValue={delivery.direction}
            style={fieldStyle}
          >
            <option value="to_them">I owe them</option>
            <option value="from_them">They owe me</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" style={labelStyle}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={delivery.description}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="due_date" style={labelStyle}>
            Due date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={delivery.due_date ?? ''}
            style={fieldStyle}
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
