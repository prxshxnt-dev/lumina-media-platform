import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const newPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const mediaSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(['image', 'video', 'reel', 'pdf', 'document', 'zip']),
  url: z.string().url('Valid URL is required'),
  thumbnail_url: z.string().url().optional().nullable(),
  file_size: z.number().optional().nullable(),
  file_format: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  is_featured: z.boolean(),
  is_downloadable: z.boolean(),
  scheduled_at: z.string().optional().nullable(),
  meta_title: z.string().max(60).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  slug: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  is_visible: z.boolean(),
  sort_order: z.number(),
});

export const videoSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  video_url: z.string().url('Valid URL is required'),
  thumbnail_url: z.string().url().optional().nullable(),
  duration: z.number().optional().nullable(),
  category_id: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  status: z.enum(['draft', 'published', 'scheduled']),
  is_featured: z.boolean(),
  is_downloadable: z.boolean(),
  quality: z.string().optional().nullable(),
});

export const documentSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  file_url: z.string().url('Valid URL is required'),
  file_type: z.string(),
  file_size: z.number().optional().nullable(),
  category_id: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'scheduled']),
  is_downloadable: z.boolean(),
});

export const settingsSchema = z.object({
  site_name: z.string().min(1),
  logo_url: z.string().url().nullable().optional(),
  favicon_url: z.string().url().nullable().optional(),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  font_heading: z.string(),
  font_body: z.string(),
  header_style: z.enum(['transparent', 'solid', 'glass']),
  footer_text: z.string(),
  hero_title: z.string(),
  hero_subtitle: z.string(),
  hero_bg_url: z.string().url().nullable().optional(),
  button_style: z.enum(['rounded', 'pill', 'sharp']),
  loader_style: z.enum(['spinner', 'progress', 'pulse']),
  cursor_effects: z.boolean(),
  social_twitter: z.string().optional(),
  social_instagram: z.string().optional(),
  social_youtube: z.string().optional(),
  social_linkedin: z.string().optional(),
  social_github: z.string().optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  avatar_url: z.string().url().nullable().optional(),
  content: z.string().min(10).max(500),
  rating: z.number().min(1).max(5),
  is_visible: z.boolean(),
  sort_order: z.number(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type MediaInput = z.infer<typeof mediaSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
