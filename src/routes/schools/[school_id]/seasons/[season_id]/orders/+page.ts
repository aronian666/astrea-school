import { dateToGroup, ExtendedDate } from '$lib/utils/extendedDate.js';
import { Filter } from '$lib/utils/filter';
import { error } from '@sveltejs/kit';


export const load = async ({ parent, params: { season_id }, url }) => {
  const input = url.searchParams.get("value") || new ExtendedDate().toInput()

  const [start, end] = ExtendedDate.getRanges(input)
  const interval = `date_trunc('${dateToGroup[input.length].interval}', created_at AT TIME ZONE 'UTC' AT TIME ZONE '-5') AT TIME ZONE 'UTC' AT TIME ZONE '+5' as interval`
  const where = `where created_at >= '${start.toISOString()}' and created_at < '${end.toISOString()}'`
  const { supabase } = await parent()
  const filter = new Filter(url)
  const query = supabase
    .from("orders")
    .select("*, class_person:class_persons!inner(person:persons!inner(first_name, last_name1, last_name2))", { count: "exact" })
    .eq("season_id", season_id).gte("created_at", start.toISOString()).lte("created_at", end.toISOString())
    .order("created_at", { ascending: false })
  const [{ data: orders, error: err1, count }, { data: group_orders, error: err2 }, { data: group_payments, error: err3 }] = await Promise.all([
    filter.paginate(query),
    supabase.rpc("run_query", { query: `select ${interval}, sum(total_value), count(*) from orders ${where} group by interval order by interval` }).returns<{ interval: string, sum: number, count: number }[]>(),
    supabase.rpc("run_query", { query: `select concepts.name, sum(final_value) from payments inner join concepts on concepts.id = payments.concept_id ${where} group by concepts.name` }).returns<{ name: string, sum: number }[]>()
  ])

  if (orders && group_orders && group_payments) return { orders, group_orders, group_payments, count }
  throw error(500, (err1 || err2 || err3)?.message)
};