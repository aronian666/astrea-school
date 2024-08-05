import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { school_id } }) => {
  const { supabase } = await parent()
  const { data: seasons, error: err } = await supabase.rpc("run_query", {
    query: `
      select seasons.id, seasons.name, coalesce(sum(payments.final_value), 0) as sum, count(DISTINCT class_persons.id) from seasons
      left join classes on classes.season_id = seasons.id
      left join class_persons on class_persons.class_id = classes.id
      left join orders on orders.class_person_id = class_persons.id
      left join payments on payments.order_id = orders.id
      where seasons.school_id = ${school_id}
      group by seasons.id;
    `}).returns<{ id: number, name: string, sum: number, count: number }[]>()
  if (err) throw error(500, err)
  return { seasons }
};