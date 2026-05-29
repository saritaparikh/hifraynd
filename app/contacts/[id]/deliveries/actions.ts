'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { completeDelivery } from '@/lib/data/deliveries'

export async function markDeliveryDone(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const delivery_id = formData.get('delivery_id') as string
  const person_id = formData.get('person_id') as string

  await completeDelivery(delivery_id, user.id)

  revalidatePath(`/contacts/${person_id}`)
}
