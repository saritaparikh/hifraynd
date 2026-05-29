'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePerson } from '@/lib/data/persons'

export async function archiveContact(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const person_id = formData.get('person_id') as string

  await updatePerson(person_id, user.id, { archived: true })

  redirect('/contacts')
}

export async function unarchiveContact(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const person_id = formData.get('person_id') as string

  await updatePerson(person_id, user.id, { archived: false })

  redirect(`/contacts/${person_id}`)
}
