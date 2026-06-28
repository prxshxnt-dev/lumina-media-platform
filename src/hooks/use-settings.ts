'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import type { SiteSettings, SiteSettingsUpdate } from '@/types';

export function useSettings() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await supabase.from('settings').select('*').limit(1).single();
      return data as SiteSettings | null;
    },
  });
}

export function useUpdateSettings() {
  const supabase = useSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SiteSettingsUpdate & { id?: string }) => {
      const id = input.id || '';
      const { data, error } = await supabase.from('settings').update(input).eq('id', id).select().single();
      if (error) throw error;
      return data as SiteSettings;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
