import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_person_id }, parent }) => {
  const { supabase } = await parent()
  const { data: orders, error: err } = await supabase.from("orders").select("id, created_at, payments(*, concept:concepts!inner(name))").eq("class_person_id", class_person_id).order("created_at")
  if (err) throw error(500, err)
  return { orders }
};