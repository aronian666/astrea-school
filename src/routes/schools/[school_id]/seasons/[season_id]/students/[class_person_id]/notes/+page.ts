import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_person_id, season_id }, parent }) => {
  const { supabase } = await parent()
  const { data: class_person, error: err1 } = await supabase.from("class_persons").select(`
    person:persons(full_name),
    class:classes!inner(
      class_season_courses!inner(
        id,
        season_course:season_courses(
          course:courses(id, name, course:course_id(name)),
          competences(*)
        ),
        notes!inner(*)
      ),
      season:seasons(
        cycles(id, name)
      )
    )`).eq("id", class_person_id).eq("class.class_season_courses.notes.class_person_id", class_person_id).single()
  if (err1) throw error(500, err1)
  return { class_person }
};