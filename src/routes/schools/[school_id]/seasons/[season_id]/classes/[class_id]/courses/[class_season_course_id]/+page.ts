import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { class_season_course_id } }) => {
  const { supabase } = await parent()
  const { data: class_school_course, error: err } = await supabase.from("class_season_courses").select("season_course:season_courses(course:courses(id, name), competences(*))").eq("id", class_season_course_id).single()
  if (err) throw error(500, err)
  return { class_school_course }
};