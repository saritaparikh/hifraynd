'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePerson } from '@/lib/data/persons'
import type { Database } from '@/lib/types/database.types'

type ContactStatus = Database['public']['Enums']['contact_status']

export async function updateContact(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const person_id = formData.get('person_id') as string
  const cadenceRaw = formData.get('cadence_days') as string

  await updatePerson(person_id, user.id, {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: (formData.get('email') as string) || null,
    title: (formData.get('title') as string) || null,
    status: formData.get('status') as ContactStatus,
    cadence_days: cadenceRaw ? Number.parseInt(cadenceRaw, 10) : null,
    next_reach_out_date: (formData.get('next_reach_out_date') as string) || null,
    how_we_met: (formData.get('how_we_met') as string) || null,
    what_i_can_do_for_them:
      (formData.get('what_i_can_do_for_them') as string) || null,
    personal_notes: (formData.get('personal_notes') as string) || null,
    professional_notes: (formData.get('professional_notes') as string) || null,
  })

  redirect(`/contacts/${person_id}`)
}
