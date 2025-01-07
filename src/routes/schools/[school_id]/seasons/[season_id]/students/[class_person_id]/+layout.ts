import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_person_id, season_id }, parent, depends }) => {
  const { supabase } = await parent()
  depends("class_person_id:layout")
  const { data: class_person, error: err1 } = await supabase.from("class_persons").select(`
    *,
    person:persons!inner(*),
    class:classes!inner(
      level:levels(name),
      area:areas!inner(name),
      section:sections(name),
      season:seasons!inner(
        name,
        cycles(id, name)
      ),
      courses(name, order, id, competences!course_competences(*), course:course_id(name))
    )`).eq("id", class_person_id).single()
  if (err1) throw error(500, err1)
  class_person.class?.season?.cycles.sort((a, b) => a.id - b.id)
  return { class_person }
};