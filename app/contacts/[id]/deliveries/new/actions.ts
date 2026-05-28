'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createDelivery as createDeliveryRecord } from '@/lib/data/deliveries'
import type { Database } from '@/lib/types/database.types'

type DeliveryDirection = Database['public']['Enums']['delivery_direction']

export async function createDelivery(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const person_id = formData.get('person_id') as string
  const direction = formData.get('direction') as DeliveryDirection
  const description = formData.get('description') as string
  const due_date = (formData.get('due_date') as string) || null

  await createDeliveryRecord({
    person_id,
    direction,
    description,
    due_date,
    user_id: user.id,
  })

  redirect(`/contacts/${person_id}`)
}
