'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateDelivery as updateDeliveryRecord } from '@/lib/data/deliveries'
import type { Database } from '@/lib/types/database.types'

type DeliveryDirection = Database['public']['Enums']['delivery_direction']

export async function updateDelivery(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const delivery_id = formData.get('delivery_id') as string
  const person_id = formData.get('person_id') as string
  const direction = formData.get('direction') as DeliveryDirection
  const description = formData.get('description') as string
  const due_date = (formData.get('due_date') as string) || null

  await updateDeliveryRecord(delivery_id, user.id, {
    direction,
    description,
    due_date,
  })

  redirect(`/contacts/${person_id}`)
}
