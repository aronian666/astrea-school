import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { supabase, session } = await parent()
  const { data: user, error: err } = await supabase
    .from("users")
    .select(`
      school_users(*, 
        school:schools!inner(name, id, seasons:seasons(name, id, start_at, end_at)), 
        role:roles(name)
      )
    `)
    .eq("id", session.user.id).single()
  if (err) throw error(500, err.message)
  return { user }
};