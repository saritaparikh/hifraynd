'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createInteraction as createInteractionRecord } from '@/lib/data/interactions'
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

  await createInteractionRecord({
    person_id,
    type,
    interaction_date,
    title,
    notes,
    user_id: user.id,
  })

  redirect(`/contacts/${person_id}`)
}
