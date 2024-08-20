import { error } from '@sveltejs/kit';

export const load = async ({ params: { class_id }, parent }) => {
  const { supabase } = await parent()
  const { data: clas, error: err } = await supabase.from("classes").select("season:seasons(cycles(id, name)), level:levels(name), grade, section:sections(name), seasons(id, name), class_persons(id, behaviors(*), person:persons(full_name))")
    .eq("id", class_id)
    .eq("class_persons.status_id", 1)
    .is("class_persons.behaviors.class_season_level_course_id", null)
    .single()
  clas?.class_persons.sort((a, b) => Number(a.person?.full_name?.localeCompare(String(b.person?.full_name))))
  if (err) throw error(500, err)
  return { clas }
};