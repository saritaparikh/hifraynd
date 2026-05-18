import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type TagRow = Database['public']['Tables']['tags']['Row']
type TagInsert = Database['public']['Tables']['tags']['Insert']

export async function getTags(userId: string): Promise<TagRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) throw new Error(`Failed to fetch tags: ${error.message}`)
  return data
}

export async function getTagsByPerson(
  personId: string,
  userId: string
): Promise<TagRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*, person_tags!inner(person_id)')
    .eq('person_tags.person_id', personId)
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) throw new Error(`Failed to fetch tags for person: ${error.message}`)
  return data
}

export async function createTag(tag: TagInsert): Promise<TagRow> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tags')
    .insert(tag)
    .select()
    .single()

  if (error) throw new Error(`Failed to create tag: ${error.message}`)
  return data
}

export async function addTagToPerson(
  personId: string,
  tagId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('person_tags')
    .insert({ person_id: personId, tag_id: tagId })

  if (error) throw new Error(`Failed to add tag to person: ${error.message}`)
}

export async function removeTagFromPerson(
  personId: string,
  tagId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('person_tags')
    .delete()
    .eq('person_id', personId)
    .eq('tag_id', tagId)

  if (error) throw new Error(`Failed to remove tag from person: ${error.message}`)
}

export async function deleteTag(
  id: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to delete tag: ${error.message}`)
}
