import { Filter } from '$lib/utils/filter.js';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { season_id }, url }) => {
  const { supabase } = await parent();
  const filter = new Filter(url)
  const query = supabase.from("carts").select(`
    *, 
    concept:concepts!inner(name, value), 
    class_person:class_persons!inner(class:classes(season_id, area:areas(name, short_name), section:sections(name), level:levels(name)), 
    person:persons!inner(id, full_name))`, { count: "exact" }).eq("class_person.class.season_id", season_id);
  const { data: carts, error: err, count } = await filter.paginate(query)
  if (err) throw error(500, err.message);
  return { carts, count };
};