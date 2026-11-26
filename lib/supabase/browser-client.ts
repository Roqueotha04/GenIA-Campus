import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabasePublishableKey, supabaseUrl } from "./env";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
