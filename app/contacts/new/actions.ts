'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createPerson } from '@/lib/data/persons'
import type { Database } from '@/lib/types/database.types'

type ContactStatus = Database['public']['Enums']['contact_status']

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const email = (formData.get('email') as string) || null
  const title = (formData.get('title') as string) || null
  const status = formData.get('status') as ContactStatus
  const cadenceRaw = formData.get('cadence_days') as string

  const defaultCadence: Record<ContactStatus, number | null> = {
    planned: 14,
    active: 30,
    potential: 30,
    nurture: 60,
    dormant: null,
  }
  const cadence_days = cadenceRaw
    ? Number.parseInt(cadenceRaw, 10)
    : defaultCadence[status]

  const today = new Date()
  today.setDate(today.getDate() + 5)
  const auto_next_reach_out = today.toISOString().split('T')[0]
  const next_reach_out_date =
    (formData.get('next_reach_out_date') as string) ||
    (status === 'planned' ? auto_next_reach_out : null)

  await createPerson({
    first_name,
    last_name,
    email,
    title,
    status,
    cadence_days,
    next_reach_out_date,
    user_id: user.id,
  })

  redirect('/contacts')
}
