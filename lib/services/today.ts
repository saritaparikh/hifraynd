import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type DeliveryRow = Database['public']['Tables']['deliveries']['Row']
type PersonRow = Database['public']['Tables']['persons']['Row']

export type DeliveryWithPerson = DeliveryRow & {
  persons: { first_name: string; last_name: string } | null
}

export type ReachOutPerson = Pick<
  PersonRow,
  'id' | 'first_name' | 'last_name' | 'next_reach_out_date'
>

// Dated entries ascending, null dates last. Date columns are YYYY-MM-DD strings.
function compareNullableAsc(a: string | null, b: string | null): number {
  if (a && b) return a.localeCompare(b)
  if (a) return -1
  if (b) return 1
  return 0
}

export async function getTodayData(userId: string) {
  const supabase = await createClient()

  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  const sevenDays = sevenDaysFromNow.toISOString().split('T')[0]
  const todayStr = new Date().toISOString().split('T')[0]

  const { data: deliveriesData, error: deliveriesError } = await supabase
    .from('deliveries')
    .select('*, persons(first_name, last_name)')
    .eq('user_id', userId)
    .eq('completed', false)

  if (deliveriesError) {
    throw new Error(`Failed to fetch deliveries: ${deliveriesError.message}`)
  }

  const { data: personsData, error: personsError } = await supabase
    .from('persons')
    .select('id, first_name, last_name, next_reach_out_date')
    .eq('user_id', userId)
    .or(`next_reach_out_date.is.null,next_reach_out_date.lte.${sevenDays}`)

  if (personsError) {
    throw new Error(`Failed to fetch persons: ${personsError.message}`)
  }

  const deliveries = (deliveriesData ?? []) as DeliveryWithPerson[]
  const persons = (personsData ?? []) as ReachOutPerson[]

  const overdueOwed = deliveries
    .filter(
      (d) =>
        d.direction === 'to_them' &&
        d.due_date !== null &&
        d.due_date < todayStr
    )
    .sort((a, b) => compareNullableAsc(a.due_date, b.due_date))

  const upcomingOwed = deliveries
    .filter(
      (d) =>
        d.direction === 'to_them' &&
        (d.due_date === null ||
          (d.due_date >= todayStr && d.due_date <= sevenDays))
    )
    .sort((a, b) => {
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date)
      if (a.due_date) return -1
      if (b.due_date) return 1
      return a.created_at.localeCompare(b.created_at)
    })

  const theyOwe = deliveries
    .filter((d) => d.direction === 'from_them')
    .sort((a, b) => compareNullableAsc(a.due_date, b.due_date))

  const reachOut = persons.sort((a, b) =>
    compareNullableAsc(a.next_reach_out_date, b.next_reach_out_date)
  )

  return {
    overdueOwed,
    upcomingOwed,
    theyOwe,
    reachOut,
  }
}

export type TodayData = Awaited<ReturnType<typeof getTodayData>>
