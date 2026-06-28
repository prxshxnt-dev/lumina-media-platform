'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './use-supabase';
import type { VideoInsert, Video } from '@/types';

export function useVideos({ search, page = 1 }: { search?: string; page?: number } = {}) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['videos', { search, page }],
    queryFn: async () => {
      let query = supabase.from('videos').select('*, categories(*)', { count: 'exact' }).eq('status', 'published').order('published_at', { ascending: false });
      if (search) query = query.ilike('title', `%${search}%`);
      const from = (page - 1) * 12;
      query = query.range(from, from + 11);
      const { data, count } = await query;
      return { items: (data as Video[]) ?? [], total: count ?? 0 };
    },
  });
}

export function useFeaturedVideos() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['videos', 'featured'],
    queryFn: async () => {
      const { data } = await supabase.from('videos').select('*, categories(*)').eq('status', 'published').eq('is_featured', true).order('published_at', { ascending: false }).limit(6);
      return (data as Video[]) ?? [];
    },
  });
}

export function useVideo(id: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['videos', id],
    queryFn: async () => {
      const { data } = await supabase.from('videos').select('*, categories(*)').eq('id', id).single();
      return data as Video | null;
    },
    enabled: !!id,
  });
}

export function useCreateVideo() {
  const supabase = useSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: VideoInsert) => {
      const { data, error } = await supabase.from('videos').insert(input).select().single();
      if (error) throw error;
      return data as Video;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['videos'] }),
  });
}

export function useDeleteVideo() {
  const supabase = useSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['videos'] }),
  });
}

export function useIncrementVideoView() {
  const supabase = useSupabase();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await supabase.rpc('increment_video_views', { video_id: id });
      return data;
    },
  });
}
