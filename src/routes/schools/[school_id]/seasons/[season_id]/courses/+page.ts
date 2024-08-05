import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { season_id } }) => {
  const { supabase } = await parent()
  const [{ data: school_courses, error: err1 }, { data: season_courses, error: err2 }] = await Promise.all([
    supabase.from("school_courses").select("course_id, level_id, course:courses(id, name, competences(id, name)), level:levels(id, name)"),
    supabase.from("season_courses").select("id, course_id, course:courses(name), level_id, competences(id, name)").eq("season_id", season_id)
  ])
  if (school_courses && season_courses) return { school_courses, season_courses }
  throw error(500, (err1 || err2)?.message)
};