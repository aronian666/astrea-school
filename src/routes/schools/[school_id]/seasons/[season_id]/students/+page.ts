import { error } from '@sveltejs/kit';
import { Filter } from '$lib/utils';

export const load = async ({ params: { season_id }, parent, url }) => {
  const filter = new Filter(url)
  const { supabase } = await parent()
  const query = supabase.from("class_persons").select(`
    id, 
    person:persons(full_name, dni), 
    class:classes(level:levels(name), 
    grade, 
    section:sections(name))
    `, { count: "exact" })
  const { data: class_persons, error: err, count } = await filter.paginate(query)
  if (err) throw error(500, err)
  return { class_persons, count }
};



