import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { session, supabase } = await parent()
  const dni = session.user.user_metadata.dni
  if (session.user.user_metadata.dni) {
    const { data, error: err } = await supabase.from("persons").select().eq("dni", dni).single()
    if (err) throw error(500, err)
    return { person: data }
  }
};