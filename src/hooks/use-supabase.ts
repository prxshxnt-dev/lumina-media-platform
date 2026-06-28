import { createClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/database.types';

let client: ReturnType<typeof createClient> | null = null;

export function useSupabase() {
  if (!client) client = createClient();
  return client;
}

export type SupabaseClient = ReturnType<typeof createClient>;
