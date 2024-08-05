import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { season_id } }) => {
  const { supabase } = await parent()
  const { data: classes, error: err } = await supabase.from("classes").select("*, level:levels(name), section:sections(name)").eq("season_id", season_id)
  if (err) throw error(500, err)
  return { classes }
};