import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/server/db/env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
