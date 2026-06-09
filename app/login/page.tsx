'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-page)' }}>
      <div className="flex flex-col items-center" style={{ maxWidth: '420px', width: '100%' }}>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--fw-medium)',
          
          color: 'var(--ochre-600)',
          marginBottom: 'var(--space-10)',
        }}>
          hiFraynd
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 'var(--fw-semi)',
          lineHeight: 'var(--lh-tight)',
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--fg-1)',
          textAlign: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          Keep your network{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            warm.
            <svg
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: '-2px',
                width: 'calc(100% + 4px)',
                height: '8px',
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              <path
                d="M2,8 C20,3 40,11 60,5 C75,1 88,9 98,6"
                fill="none"
                stroke="var(--ochre-500)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--fw-regular)',
          lineHeight: 'var(--lh-relaxed)',
          color: 'var(--fg-2)',
          textAlign: 'center',
          maxWidth: '340px',
          marginBottom: 'var(--space-9)',
        }}>
          Keep track of your professional relationships so no one slips through the cracks.
        </p>

        <button
          onClick={signInWithGoogle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--cocoa-900)',
            color: 'var(--cream)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--fw-semi)',
            padding: '14px 28px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            marginBottom: 'var(--space-5)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--cocoa-300)',
          textAlign: 'center',
        }}>
          Takes about a minute to set up.
        </p>

      </div>
    </div>
  )
}
