import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type PersonRow = Database['public']['Tables']['persons']['Row']

export type PersonWithContext = PersonRow & {
  companies: { name: string } | null
}

export async function getPersonsWithContext(userId: string): Promise<PersonWithContext[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('persons')
    .select('*, companies(name)')
    .eq('user_id', userId)
    .order('last_name', { ascending: true })

  if (error) throw new Error(`Failed to fetch persons: ${error.message}`)
  return data as PersonWithContext[]
}
