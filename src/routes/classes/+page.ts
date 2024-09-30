import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { supabase, session } = await parent()
  const { data: class_courses, error: err1 } = await supabase.from("class_courses").select(`
      class:classes!inner(id, level:levels!inner(name), grade, section:sections!inner(name)), 
      course:courses!inner(id, name)
    `)
    .eq("person_dni", session.user.user_metadata.dni)
  if (err1) throw error(500, err1)
  return { class_courses }
};