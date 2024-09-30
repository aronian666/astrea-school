import { error, redirect } from '@sveltejs/kit';

export const load = async ({ parent, params: { class_id } }) => {
  const { supabase, session } = await parent()
  const { data: clas, error: err } = await supabase.from("classes").select(`
      id,
      season:seasons!inner(cycles(id, name), school:schools(name)), 
      level:levels!inner(name), 
      grade, 
      section:sections!inner(name), 
      class_persons(
        id, person:persons!inner(full_name, first_name, last_name1, last_name2)
      ), 
      class_courses(
        course:courses!inner(id, name, competences!course_competences(*))
      )
    `).eq("id", class_id).eq("class_courses.person_dni", session.user.user_metadata.dni).eq("class_persons.status_id", 1).single()
  console.log(err)
  if (err) throw error(500, err)

  //@ts-ignore
  clas.class_persons.sort((a, b) => a.person?.full_name?.localeCompare(b.person?.full_name))
  return { clas }
};