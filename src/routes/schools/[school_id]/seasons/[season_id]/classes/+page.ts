import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { season_id } }) => {
  const { supabase } = await parent()
  const [{ data: classes, error: err1 }, { data: levels, error: err2 }] = await Promise.all([
    supabase.from("classes").select("*, area:areas!inner(name, short_name), level:levels(name), section:sections(name)").eq("season_id", season_id).order("area_id").order("section_id"),
    supabase.from("levels").select("*, areas(*)"),
  ])
  if (classes && levels) return { classes, levels }
  throw error(500, (err1 || err2)?.message)
};