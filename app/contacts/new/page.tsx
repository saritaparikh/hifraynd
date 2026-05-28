import Link from 'next/link'
import { createContact } from './actions'

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

export default function NewContactPage() {
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
        Add Contact
      </h1>

      <form
        action={createContact}
        className="flex flex-col"
        style={{ gap: 'var(--space-5)', maxWidth: '480px' }}
      >
        <div>
          <label htmlFor="first_name" style={labelStyle}>
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
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
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input id="email" name="email" type="email" style={fieldStyle} />
        </div>

        <div>
          <label htmlFor="title" style={labelStyle}>
            Title
          </label>
          <input id="title" name="title" type="text" style={fieldStyle} />
        </div>

        <div>
          <label htmlFor="status" style={labelStyle}>
            Status
          </label>
          <select id="status" name="status" required style={fieldStyle}>
            <option value="potential">Potential</option>
            <option value="active">Active</option>
            <option value="nurture">Nurture</option>
            <option value="dormant">Dormant</option>
          </select>
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
          Add Contact
        </button>
      </form>
    </main>
  )
}
