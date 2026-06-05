import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type DeliveryRow = Database['public']['Tables']['deliveries']['Row']
type DeliveryInsert = Database['public']['Tables']['deliveries']['Insert']
type DeliveryUpdate = Database['public']['Tables']['deliveries']['Update']

export async function getDeliveriesByPerson(
  personId: string,
  userId: string
): Promise<DeliveryRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('person_id', personId)
    .eq('user_id', userId)
    .order('due_date', { ascending: true })

  if (error) throw new Error(`Failed to fetch deliveries: ${error.message}`)
  return data
}

export async function getOverdueDeliveries(
  userId: string
): Promise<DeliveryRow[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
    .lt('due_date', today)
    .order('due_date', { ascending: true })

  if (error) throw new Error(`Failed to fetch overdue deliveries: ${error.message}`)
  return data
}

export async function getDeliveryById(
  id: string,
  userId: string
): Promise<DeliveryRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch delivery: ${error.message}`)
  }
  return data
}

export async function createDelivery(
  delivery: DeliveryInsert
): Promise<DeliveryRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deliveries')
    .insert(delivery)
    .select()
    .single()

  if (error) throw new Error(`Failed to create delivery: ${error.message}`)
  return data
}

export async function updateDelivery(
  id: string,
  userId: string,
  updates: DeliveryUpdate
): Promise<DeliveryRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deliveries')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update delivery: ${error.message}`)
  return data
}

export async function completeDelivery(
  id: string,
  userId: string
): Promise<DeliveryRow> {
  return updateDelivery(id, userId, {
    completed: true,
    completed_at: new Date().toISOString(),
  })
}

export async function deleteDelivery(
  id: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to delete delivery: ${error.message}`)
}
