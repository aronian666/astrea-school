import { error } from '@sveltejs/kit';

export const load = async ({ params: { order_id }, parent }) => {
  const { supabase } = await parent()
  const { data: order, error: err } = await supabase.from("orders").select("*, payments(*, concept:concepts(name)), person:persons!inner(full_name, dni), class_person:class_persons(class:classes(grade, section:sections(name), level:levels(name)),person:persons!inner(full_name))").eq("id", order_id).single()
  if (err) throw error(500, err)
  return { order }
};