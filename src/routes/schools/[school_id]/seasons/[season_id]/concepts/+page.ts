import { error } from '@sveltejs/kit';

export const load = async ({ params: { season_id }, parent }) => {
  const { supabase } = await parent()
  const { data: concepts, error: err } = await supabase.from("concepts").select("*, discounts(*)").eq("season_id", season_id)
  if (err) throw error(500, err)
  return { concepts }
};