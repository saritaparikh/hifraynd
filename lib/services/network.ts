import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type PersonRow = Database['public']['Tables']['persons']['Row']
type ContactStatus = Database['public']['Enums']['contact_status']

export type PersonWithContext = PersonRow & {
  companies: { name: string } | null
  last_contact_date: string | null
}

export async function getPersonsWithContext(
  userId: string,
  options?: { status?: string; sort?: string }
): Promise<PersonWithContext[]> {
  const supabase = await createClient()

  let query = supabase
    .from('persons_with_last_contact')
    .select('*, companies(name)')
    .eq('user_id', userId)
    .eq('archived', false)

  if (options?.status) {
    query = query.eq('status', options.status as ContactStatus)
  }

  if (options?.sort === 'reach_out') {
    query = query.order('next_reach_out_date', {
      ascending: true,
      nullsFirst: false,
    })
  } else {
    query = query.order('last_name', { ascending: true })
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch persons: ${error.message}`)
  return data as PersonWithContext[]
}
