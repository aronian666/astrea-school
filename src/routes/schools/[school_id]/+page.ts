import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
    const { supabase } = await parent()
    const { data: school_users, error: err } = await supabase.from("school_users").select("*, user:users(name, email, picture), role:roles(*)").eq("school_id", params.school_id)
    if (err) throw error(500, err.message)
    return { school_users }
};