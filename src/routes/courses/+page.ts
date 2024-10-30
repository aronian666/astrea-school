import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { supabase } = await parent()
  const { data: courses, error: err } = await supabase.from("courses").select("*, competences!course_competences(id, name)").order("name")
  if (err) throw error(500, err)
  return { courses }
};