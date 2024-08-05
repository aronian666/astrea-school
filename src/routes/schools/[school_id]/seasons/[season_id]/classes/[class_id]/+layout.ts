import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_id }, parent }) => {
  const { supabase } = await parent()
  const { data, error: err } = await supabase.from("classes").select("*, class_persons(id, person:persons(full_name)), level:levels(name), section:sections(name), class_season_courses(id, season_course:season_courses(course:courses(name, id)), person:persons(full_name))").eq("id", class_id).single()

  if (err) throw error(500, err.message)
  data.class_season_courses.sort((a, b) => a.id - b.id)
  return { class: data }
};