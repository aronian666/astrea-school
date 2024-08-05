// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from "$lib/types/supabase";
import type { SupabaseClient, Session, User } from "@supabase/supabase-js"
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
    }
    interface PageData {
      session: Session | null
      supabase: SupabaseClient<Database>
    }
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
