import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { class_season_level_course_id } }) => {
  const { supabase } = await parent()
  const { data: behaviors, error: err } = await supabase.from("behaviors").select("*").eq("class_season_level_course_id", class_season_level_course_id)
  if (err) throw error(500, err)
  return { behaviors }
};