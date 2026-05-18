import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type CompanyRow = Database['public']['Tables']['companies']['Row']
type CompanyInsert = Database['public']['Tables']['companies']['Insert']
type CompanyUpdate = Database['public']['Tables']['companies']['Update']

export async function getCompanies(userId: string): Promise<CompanyRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) throw new Error(`Failed to fetch companies: ${error.message}`)
  return data
}

export async function getCompanyById(
  id: string,
  userId: string
): Promise<CompanyRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch company: ${error.message}`)
  }
  return data
}

export async function createCompany(
  company: CompanyInsert
): Promise<CompanyRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single()

  if (error) throw new Error(`Failed to create company: ${error.message}`)
  return data
}

export async function updateCompany(
  id: string,
  userId: string,
  updates: CompanyUpdate
): Promise<CompanyRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update company: ${error.message}`)
  return data
}

export async function deleteCompany(
  id: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to delete company: ${error.message}`)
}
