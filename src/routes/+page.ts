import { error, redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { session, supabase } = await parent()
  if (session) {
    const { data: class_season_level_courses, error: err1 } = await supabase.from("class_season_courses").select(`
      id,
      class:classes(id, level:levels(name), grade, section:sections(name)), 
      season_course:season_courses(
        course_id, 
        season:seasons(
            name, 
            id, 
            school:schools(name)
        ), 
        course:courses(id, name)
      )`).eq("person_dni", session.user.user_metadata.dni)
    if (err1) throw error(500, err1)
    return { class_season_level_courses }
  }
};