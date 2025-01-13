import { error } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
    const { supabase } = await parent();
    const { data: payments, error: err } = await supabase
        .from("payments")
        .select("*, concept:concepts!inner(name), order:orders!inner(class_person:class_persons!inner(person:persons!inner(full_name, dni), class:classes!inner(level:levels!inner(name), area:areas(name, short_name), section:sections(name))))")
        .eq("order.class_person.class.season_id", params.season_id)
    if (err) throw error(500, err.message);
    return { payments }
};