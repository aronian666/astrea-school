import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_person_id }, parent, depends }) => {
  depends("update:carts")
  const { supabase } = await parent()
  const [{ data: carts, error: err1 }, { data: concepts, error: err2 }] = await Promise.all([
    supabase.from("view_carts").select("*, concept:concepts!inner(name, value), discount:discounts(name, value)").eq("class_person_id", class_person_id).order("created_at"),
    supabase.from("concepts").select("*, discounts(*)"),

  ])
  if (carts && concepts) return { carts, concepts }
  throw error(500, (err1 || err2)?.message)
};