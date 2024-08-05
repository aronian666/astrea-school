import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_person_id, season_id }, parent }) => {
  const { supabase } = await parent()
  const [{ data: class_person, error: err1 }, { data: cycles, error: err2 }] = await Promise.all([supabase.from("class_persons").select(`
    person:persons(full_name),
    notes(*),
    class:classes(
      class_season_courses(
        id,
        season_course:season_courses(
          course:courses(name),
          competences(*)
        )
      )
    )`).eq("id", class_person_id).single(), supabase.from("cycles").select().eq("season_id", season_id).order("id")])

  if (class_person && cycles) return { class_person, cycles }
  throw error(500, (err1 || err2)?.message)
};