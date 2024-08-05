import type { Tables } from '$lib/types/supabase.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
  const { session, supabase } = await parent()
  if (session) {
    const [{ data: school_users, error: err2 }, { data: seasons, error: err1 }] = await Promise.all([
      supabase.from("school_users").select("school:schools(name, id), role:roles(name)").eq("user_id", session.user.id),
      supabase.rpc("run_query", {
        query: `
        select seasons.*, row_to_json(schools) as school, count(*) from class_season_courses 
        inner join classes on classes.id = class_season_courses.class_id 
        inner join seasons on seasons.id = classes.season_id
        inner join schools on schools.id = seasons.school_id
        where person_dni = '${session.user.user_metadata.dni}'
        group by seasons.id, schools.id;
        `
      }).returns<(Tables<"seasons"> & { school: Tables<"schools">, count: number })[]>()
    ])

    if (seasons && school_users) return { school_users, seasons }
    throw error(500, (err1 || err2)?.message)
  }
};