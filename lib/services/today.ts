import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

export type DeliveryItem = {
  id: string
  direction: 'to_them' | 'from_them'
  description: string
  due_date: string | null
}

export type PersonTodayCard = {
  id: string
  first_name: string
  last_name: string
  next_reach_out_date: string | null
  deliveries: DeliveryItem[]
}

export type TodayData = {
  urgent: PersonTodayCard[]
  this_week: PersonTodayCard[]
  no_date: PersonTodayCard[]
}

type DeliveryRow = Database['public']['Tables']['deliveries']['Row']
type JoinedDelivery = DeliveryRow & {
  persons: {
    id: string
    first_name: string
    last_name: string
    next_reach_out_date: string | null
  } | null
}

type ReachOutPerson = {
  id: string
  first_name: string
  last_name: string
  next_reach_out_date: string | null
}

export async function getTodayData(userId: string): Promise<TodayData> {
  const supabase = await createClient()

  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  const sevenDaysStr = sevenDaysFromNow.toISOString().split('T')[0]
  const todayStr = new Date().toISOString().split('T')[0]

  const { data: deliveriesData, error: deliveriesError } = await supabase
    .from('deliveries')
    .select('*, persons!inner(id, first_name, last_name, next_reach_out_date)')
    .eq('user_id', userId)
    .eq('completed', false)
    .eq('persons.archived', false)

  if (deliveriesError) {
    throw new Error(`Failed to fetch deliveries: ${deliveriesError.message}`)
  }

  const { data: personsData, error: personsError } = await supabase
    .from('persons')
    .select('id, first_name, last_name, next_reach_out_date')
    .eq('user_id', userId)
    .eq('archived', false)
    .or(`next_reach_out_date.is.null,next_reach_out_date.lte.${sevenDaysStr}`)

  if (personsError) {
    throw new Error(`Failed to fetch persons: ${personsError.message}`)
  }

  const deliveries = (deliveriesData ?? []) as unknown as JoinedDelivery[]
  const reachOutPersons = (personsData ?? []) as ReachOutPerson[]

  const map = new Map<string, PersonTodayCard>()

  for (const d of deliveries) {
    const p = d.persons
    if (!p) continue
    let card = map.get(p.id)
    if (!card) {
      card = {
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        next_reach_out_date: p.next_reach_out_date,
        deliveries: [],
      }
      map.set(p.id, card)
    }
    card.deliveries.push({
      id: d.id,
      direction: d.direction,
      description: d.description,
      due_date: d.due_date,
    })
  }

  for (const p of reachOutPersons) {
    if (!map.has(p.id)) {
      map.set(p.id, {
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        next_reach_out_date: p.next_reach_out_date,
        deliveries: [],
      })
    }
  }

  const urgent: PersonTodayCard[] = []
  const this_week: PersonTodayCard[] = []
  const no_date: PersonTodayCard[] = []

  for (const card of map.values()) {
    const hasOverdueDelivery = card.deliveries.some(
      (d) => d.due_date !== null && d.due_date < todayStr
    )
    const reachOutUrgent =
      card.next_reach_out_date !== null && card.next_reach_out_date <= todayStr

    if (hasOverdueDelivery || reachOutUrgent) {
      urgent.push(card)
      continue
    }

    const hasWeekDelivery = card.deliveries.some(
      (d) => d.due_date !== null && d.due_date <= sevenDaysStr
    )
    const reachOutThisWeek =
      card.next_reach_out_date !== null &&
      card.next_reach_out_date <= sevenDaysStr

    if (hasWeekDelivery || reachOutThisWeek) {
      this_week.push(card)
      continue
    }

    no_date.push(card)
  }

  const earliestOverdueDate = (card: PersonTodayCard): string => {
    const dates: string[] = []
    for (const d of card.deliveries) {
      if (d.due_date && d.due_date < todayStr) dates.push(d.due_date)
    }
    if (card.next_reach_out_date && card.next_reach_out_date <= todayStr) {
      dates.push(card.next_reach_out_date)
    }
    return dates.sort()[0] ?? ''
  }

  const earliestUpcomingDate = (card: PersonTodayCard): string => {
    const dates: string[] = []
    for (const d of card.deliveries) {
      if (d.due_date && d.due_date <= sevenDaysStr) dates.push(d.due_date)
    }
    if (
      card.next_reach_out_date &&
      card.next_reach_out_date <= sevenDaysStr
    ) {
      dates.push(card.next_reach_out_date)
    }
    return dates.sort()[0] ?? ''
  }

  urgent.sort((a, b) =>
    earliestOverdueDate(a).localeCompare(earliestOverdueDate(b))
  )
  this_week.sort((a, b) =>
    earliestUpcomingDate(a).localeCompare(earliestUpcomingDate(b))
  )
  no_date.sort((a, b) => a.last_name.localeCompare(b.last_name))

  return { urgent, this_week, no_date }
}
