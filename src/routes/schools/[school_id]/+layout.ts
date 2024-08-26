import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { school_id } }) => {
  const { supabase, session } = await parent()
  const { data: school_user, error: err } = await supabase.from("school_users").select(`
    role:roles(name), 
    school_id,
    school:schools!inner(name, seasons(name, id), logo)
  `).match({ user_id: session.user.id, school_id }).single()
  if (err) throw error(500, err.message)
  return { school_user }
};
