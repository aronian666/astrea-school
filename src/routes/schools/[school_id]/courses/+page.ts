import { error } from '@sveltejs/kit';

export const load = async ({ params: { school_id }, parent }) => {
  const { supabase } = await parent()
  const [{ data: courses, error: err1 }, { data: levels, error: err2 }, { data: school_courses, error: err3 }] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .order("name")
    ,
    supabase
      .from("levels")
      .select("*")
      .order("id")
    ,
    supabase.from("school_courses").select("*, course:courses(name), level:levels(name)").eq("school_id", school_id)
  ])
  if (courses && levels && school_courses) return { courses, levels, school_courses }
  throw error(500, (err1 || err2 || err3)?.message)
};