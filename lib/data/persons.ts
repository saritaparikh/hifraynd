import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type PersonRow = Database['public']['Tables']['persons']['Row']
type PersonInsert = Database['public']['Tables']['persons']['Insert']
type PersonUpdate = Database['public']['Tables']['persons']['Update']

export async function getPersons(userId: string): Promise<PersonRow[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('persons')
    .select('*')
    .eq('user_id', userId)
    .order('last_name', { ascending: true })

  if (error) throw new Error(`Failed to fetch persons: ${error.message}`)
  return data
}

export async function getPersonById(
  id: string,
  userId: string
): Promise<PersonRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('persons')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch person: ${error.message}`)
  }
  return data
}

export async function createPerson(
  person: PersonInsert
): Promise<PersonRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('persons')
    .insert(person)
    .select()
    .single()

  if (error) throw new Error(`Failed to create person: ${error.message}`)
  return data
}

export async function updatePerson(
  id: string,
  userId: string,
  updates: PersonUpdate
): Promise<PersonRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('persons')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update person: ${error.message}`)
  return data
}

export async function deletePerson(
  id: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('persons')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to delete person: ${error.message}`)
}
