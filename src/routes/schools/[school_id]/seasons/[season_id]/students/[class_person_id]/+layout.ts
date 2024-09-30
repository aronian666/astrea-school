import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_person_id, season_id }, parent }) => {
  const { supabase } = await parent()
  const { data: class_person, error: err1 } = await supabase.from("class_persons").select(`
    *,
    person:persons(*),
    
    class:classes!inner(
      level:levels(name),
      grade,
      section:sections(name),
      season:seasons(
        name,
        cycles(id, name)
      )
    )`).eq("id", class_person_id).single()
  if (err1) throw error(500, err1)
  class_person.class?.season?.cycles.sort((a, b) => a.id - b.id)
  return { class_person }
};