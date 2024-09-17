import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { supabase, session } = await parent()
  const { data: school_users, error: err } = await supabase
    .from("school_users")
    .select(`
      school:schools!inner(name, id, seasons(name, id, period)), 
      role:roles(name)
    `)
    .eq("user_id", session.user.id)
  if (err) throw error(500, err.message)
  return { school_users }
};