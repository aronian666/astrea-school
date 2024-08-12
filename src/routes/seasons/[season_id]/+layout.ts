import { groupBy } from '$lib/utils/groupBy';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { season_id } }) => {
  const { supabase, session } = await parent()
  const { data: season, error: err } = await
    supabase.from("seasons").select(`
    id, 
    name, 
    school:schools(name),
    cycles(id, name),
    season_levels(
      level:levels(name),
      season_level_courses(
        class_season_level_courses!inner(
          id,
          season_level_course:season_level_courses(course:courses(name)),
          class:classes(person:persons(id, dni, full_name), grade, section_id, section:sections(name), level:levels(name, id, icon))
        )
      )
    ),
    classes!inner(id, grade, level:levels(name), section:sections(name))
  `).eq("id", season_id).eq("season_levels.season_level_courses.class_season_level_courses.person_dni", session.user.user_metadata.dni).eq("classes.person_dni", session.user.user_metadata.dni).single()

  if (err) throw error(500, err)
  return { season }
};