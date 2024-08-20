import { error, redirect } from '@sveltejs/kit';

export const load = async ({ parent, params: { class_id } }) => {
  const { supabase, session } = await parent()
  const { data: clas, error: err } = await supabase.from("classes").select("id,season:seasons(cycles(id, name)), level:levels(name), grade, section:sections(name), class_persons(id, person:persons(full_name)), class_season_level_courses(id,season_level_course:season_level_courses(course:courses(name)))").eq("id", class_id).eq("class_season_level_courses.person_dni", session.user.user_metadata.dni).single()
  if (err) throw error(500, err)
  return { clas }
};