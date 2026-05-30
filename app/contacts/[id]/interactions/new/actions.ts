'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createInteraction as createInteractionRecord } from '@/lib/data/interactions'
import { getPersonById, updatePerson } from '@/lib/data/persons'
import type { Database } from '@/lib/types/database.types'

type InteractionType = Database['public']['Enums']['interaction_type']

export async function createInteraction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const person_id = formData.get('person_id') as string
  const type = formData.get('type') as InteractionType
  const interaction_date = formData.get('interaction_date') as string
  const title = (formData.get('title') as string) || null
  const notes = (formData.get('notes') as string) || null
  const resets_cadence = formData.get('resets_cadence') === 'on'

  await createInteractionRecord({
    person_id,
    type,
    interaction_date,
    title,
    notes,
    resets_cadence,
    user_id: user.id,
  })

  const person = await getPersonById(person_id, user.id)
  if (person?.cadence_days && resets_cadence) {
    const [year, month, day] = interaction_date.split('-').map(Number)
    const nextDate = new Date(year, month - 1, day)
    nextDate.setDate(nextDate.getDate() + person.cadence_days)
    const next_reach_out_date = nextDate.toISOString().split('T')[0]

    await updatePerson(person_id, user.id, { next_reach_out_date })
  }

  redirect(`/contacts/${person_id}`)
}
