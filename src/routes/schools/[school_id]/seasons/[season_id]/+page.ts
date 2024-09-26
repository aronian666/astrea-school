import { error } from '@sveltejs/kit'

export const load = async ({ params: { season_id }, parent }) => {
  const { supabase } = await parent()
  const { data: season, error: err } = await supabase.from('seasons').select('*, season_persons(person:persons!inner(full_name), role:roles!inner(name))').eq('id', season_id).single()
  if (err) throw error(500, err.message)
  return { season }
}