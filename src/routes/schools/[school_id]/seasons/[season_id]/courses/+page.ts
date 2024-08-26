import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { season_id } }) => {
  const { supabase } = await parent()
  const [{ data: courses, error: err1 }, { data: season_courses, error: err2 }, { data: levels, error: err3 }] = await Promise.all([
    supabase.from("courses").select("id, name, competences(id, name)"),
    supabase.from("season_courses").select("*, level:levels!inner(id, name), course:courses!inner(name, competences(*)), competences(id, name)").eq("season_id", season_id),
    supabase.from("levels").select("id, name")
  ])
  if (courses && season_courses && levels) return { courses, season_courses, levels }
  throw error(500, (err1 || err2 || err3)?.message)
};