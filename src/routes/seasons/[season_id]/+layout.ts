import { error } from '@sveltejs/kit';

export const load = async ({ parent, params: { season_id } }) => {
  const { supabase, session } = await parent()
  const [{ data: season, error: err1 }, { data: class_season_courses, error: err2 }] = await Promise.all([
    supabase.from("seasons").select("id, name, school:schools(name)").eq("id", season_id).single(),
    supabase.from("class_season_courses").select("*, season_course:season_courses(course:courses(name)), classes!inner(grade, section_id, section:sections(name), level:levels(name, id, icon),season_id)").eq("person_dni", session.user.user_metadata.dni).eq("classes.season_id", season_id).order("grade", { referencedTable: "classes" })
  ])
  if (season && class_season_courses) {
    class_season_courses.sort((a, b) => a.classes.grade - b.classes.grade + a.classes.section_id - b.classes.section_id)
    const levels = Object.groupBy(class_season_courses, ({ classes }) => String(classes.level?.name))
    const courses = Object.groupBy(class_season_courses, ({ season_course }) => String(season_course?.course?.name))
    //Object.entries(levels).forEach(([_, class_season_courses]) => class_season_courses?.sort((a, b) => a.classes.grade - b.classes.grade + a.classes.section_id - b.classes.section_id))
    return { class_season_courses, levels, courses, season }

  }
  throw error(500, (err1 || err2)?.message)
};