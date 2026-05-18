import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type InteractionRow = Database['public']['Tables']['interactions']['Row']
type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
type InteractionUpdate = Database['public']['Tables']['interactions']['Update']

export async function getInteractionsByPerson(
  personId: string,
  userId: string
): Promise<InteractionRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('person_id', personId)
    .eq('user_id', userId)
    .order('interaction_date', { ascending: false })

  if (error) throw new Error(`Failed to fetch interactions: ${error.message}`)
  return data
}

export async function getRecentInteractions(
  userId: string,
  days: number = 7
): Promise<InteractionRow[]> {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', userId)
    .gte('interaction_date', since.toISOString().split('T')[0])
    .order('interaction_date', { ascending: false })

  if (error) throw new Error(`Failed to fetch recent interactions: ${error.message}`)
  return data
}

export async function createInteraction(
  interaction: InteractionInsert
): Promise<InteractionRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interactions')
    .insert(interaction)
    .select()
    .single()

  if (error) throw new Error(`Failed to create interaction: ${error.message}`)
  return data
}

export async function updateInteraction(
  id: string,
  userId: string,
  updates: InteractionUpdate
): Promise<InteractionRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update interaction: ${error.message}`)
  return data
}

export async function deleteInteraction(
  id: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to delete interaction: ${error.message}`)
}
