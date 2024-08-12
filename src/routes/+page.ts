import type { Tables } from '$lib/types/supabase.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { session, supabase } = await parent()
  if (session) {
    const [{ data: school_users, error: err2 }, { data: class_season_level_courses, error: err1 }] = await Promise.all([
      supabase.from("school_users").select("school:schools(name, id), role:roles(name)").eq("user_id", session.user.id),
      supabase.from("class_season_level_courses").select("*, season_level_course:season_level_courses(course_id, season_level:season_levels(season:seasons(name, id, school:schools(name))), course:courses(id, name))").eq("person_dni", session.user.user_metadata.dni)
    ])

    if (class_season_level_courses && school_users) return { school_users, class_season_level_courses }
    throw error(500, (err1 || err2)?.message)
  }
};