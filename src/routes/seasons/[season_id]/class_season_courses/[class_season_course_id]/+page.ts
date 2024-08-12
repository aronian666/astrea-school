import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { class_season_course_id } }) => {
  const { supabase } = await parent()
  const { data: class_season_level_courses, error: err } = await supabase.from("class_season_level_courses").select(`
    id,
    person:persons(full_name, id),
    season_level_course:season_level_courses(course:courses(name), competences(id, name)),
    notes(*),
    class:classes!inner(
      grade,
      section:sections(name), 
      level:levels(name), 
      class_persons!inner(id, person:persons(full_name)),
      season:seasons(cycles(*))
    )
  `).eq("id", class_season_course_id).eq("class.class_persons.status_id", 1).single()
  if (err) throw error(500, err)
  // @ts-ignore
  class_season_level_courses.class?.class_persons.sort((a, b) => a.person?.full_name?.localeCompare(String(b.person?.full_name)))
  class_season_level_courses.class?.season?.cycles.sort((a, b) => a.id - b.id)

  return { class_season_level_courses }
};