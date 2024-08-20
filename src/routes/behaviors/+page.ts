import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { supabase, session } = await parent()
  const { data: classes, error: err } = await supabase.from("classes").select("id, level:levels(name), grade, section:sections(name)").eq("person_dni", session?.user.user_metadata.dni)
  if (err) throw error(500, err)
  return { classes }
};