import { Filter } from '$lib/utils/filter';
import { error } from '@sveltejs/kit';


export const load = async ({ parent, params: { season_id }, url }) => {
  const { supabase } = await parent()
  const filter = new Filter(url)
  const query = supabase.from("orders").select("*, class_person:class_persons!inner(person:persons!inner(first_name, last_name1, last_name2))", { count: "exact" }).eq("season_id", season_id).order("created_at", { ascending: false })
  const { data: orders, error: err, count } = await filter.paginate(query)
  if (err) throw error(500, err)
  return { orders, count }
};