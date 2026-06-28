import { createClient } from './supabase-server';
import type { Database } from './database.types';
import { PAGE_SIZE } from './constants';

type Settings = Database['public']['Tables']['settings']['Row'];
type HomepageSection = Database['public']['Tables']['homepage_sections']['Row'];
type Media = Database['public']['Tables']['media']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Video = Database['public']['Tables']['videos']['Row'];
type Document = Database['public']['Tables']['documents']['Row'];
type Testimonial = Database['public']['Tables']['testimonials']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export async function getSettings(): Promise<Settings | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('settings').select('*').limit(1).single();
  return data as Settings | null;
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('homepage_sections').select('*').order('sort_order', { ascending: true });
  return (data as HomepageSection[]) ?? [];
}

export async function getPublishedMedia({ page = 1, type, category, search }: { page?: number; type?: string; category?: string; search?: string } = {}): Promise<{ items: Media[]; total: number; hasMore: boolean }> {
  const supabase = await createClient();
  let query = supabase.from('media').select('*, categories(*)', { count: 'exact' }).eq('status', 'published').order('published_at', { ascending: false });
  if (type) query = query.eq('type', type);
  if (category) query = query.eq('category_id', category);
  if (search) query = query.ilike('title', `%${search}%`);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);
  const { data, count } = await query;
  return { items: (data as Media[]) ?? [], total: count ?? 0, hasMore: (count ?? 0) > to + 1 };
}

export async function getFeaturedMedia(type?: string): Promise<Media[]> {
  const supabase = await createClient();
  let query = supabase.from('media').select('*, categories(*)').eq('status', 'published').eq('is_featured', true).order('published_at', { ascending: false }).limit(8);
  if (type) query = query.eq('type', type);
  const { data } = await query;
  return (data as Media[]) ?? [];
}

export async function getTrendingMedia(): Promise<Media[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('media').select('*, categories(*)').eq('status', 'published').order('views', { ascending: false }).limit(6);
  return (data as Media[]) ?? [];
}

export async function getLatestUploads(): Promise<Media[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('media').select('*, categories(*)').eq('status', 'published').order('created_at', { ascending: false }).limit(8);
  return (data as Media[]) ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').eq('is_visible', true).order('sort_order', { ascending: true });
  return (data as Category[]) ?? [];
}

export async function getPublishedVideos({ page = 1, search }: { page?: number; search?: string } = {}): Promise<{ items: Video[]; total: number; hasMore: boolean }> {
  const supabase = await createClient();
  let query = supabase.from('videos').select('*, categories(*)', { count: 'exact' }).eq('status', 'published').order('published_at', { ascending: false });
  if (search) query = query.ilike('title', `%${search}%`);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);
  const { data, count } = await query;
  return { items: (data as Video[]) ?? [], total: count ?? 0, hasMore: (count ?? 0) > to + 1 };
}

export async function getFeaturedVideos(): Promise<Video[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('videos').select('*, categories(*)').eq('status', 'published').eq('is_featured', true).order('published_at', { ascending: false }).limit(6);
  return (data as Video[]) ?? [];
}

export async function getVideoById(id: string): Promise<Video | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('videos').select('*, categories(*)').eq('id', id).single();
  return data as Video | null;
}

export async function getRelatedVideos(videoId: string, categoryId?: string | null): Promise<Video[]> {
  const supabase = await createClient();
  let query = supabase.from('videos').select('*, categories(*)').eq('status', 'published').neq('id', videoId).limit(4);
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data } = await query;
  return (data as Video[]) ?? [];
}

export async function getPublishedDocuments({ page = 1, search }: { page?: number; search?: string } = {}): Promise<{ items: Document[]; total: number; hasMore: boolean }> {
  const supabase = await createClient();
  let query = supabase.from('documents').select('*, categories(*)', { count: 'exact' }).eq('status', 'published').order('created_at', { ascending: false });
  if (search) query = query.ilike('title', `%${search}%`);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);
  const { data, count } = await query;
  return { items: (data as Document[]) ?? [], total: count ?? 0, hasMore: (count ?? 0) > to + 1 };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('testimonials').select('*').eq('is_visible', true).order('sort_order', { ascending: true });
  return (data as Testimonial[]) ?? [];
}

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return profile as Profile | null;
}
