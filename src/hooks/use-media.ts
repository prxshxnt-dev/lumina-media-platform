'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import type { MediaInsert, MediaUpdate, Media } from '@/types';

export function useMedia({ type, category, search, page = 1 }: { type?: string; category?: string; search?: string; page?: number } = {}) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['media', { type, category, search, page }],
    queryFn: async () => {
      let query = supabase.from('media').select('*, categories(*)', { count: 'exact' }).eq('status', 'published').order('published_at', { ascending: false });
      if (type) query = query.eq('type', type);
      if (category) query = query.eq('category_id', category);
      if (search) query = query.ilike('title', `%${search}%`);
      const from = (page - 1) * 12;
      query = query.range(from, from + 11);
      const { data, count } = await query;
      return { items: (data as Media[]) ?? [], total: count ?? 0 };
    },
  });
}

export function useFeaturedMedia(type?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['media', 'featured', type],
    queryFn: async () => {
      let query = supabase.from('media').select('*, categories(*)').eq('status', 'published').eq('is_featured', true).order('published_at', { ascending: false }).limit(8);
      if (type) query = query.eq('type', type);
      const { data } = await query;
      return (data as Media[]) ?? [];
    },
  });
}

export function useCreateMedia() {
  const supabase = useSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MediaInsert) => {
      const { data, error } = await supabase.from('media').insert(input).select().single();
      if (error) throw error;
      return data as Media;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });
}

export function useUpdateMedia() {
  const supabase = useSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: MediaUpdate & { id: string }) => {
      const { data, error } = await supabase.from('media').update(input).eq('id', id).select().single();
      if (error) throw error;
      return data as Media;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });
}

export function useDeleteMedia() {
  const supabase = useSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });
}
