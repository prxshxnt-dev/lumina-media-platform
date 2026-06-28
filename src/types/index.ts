import type { Database } from '@/lib/database.types';

export type Media = Database['public']['Tables']['media']['Row'];
export type MediaInsert = Database['public']['Tables']['media']['Insert'];
export type MediaUpdate = Database['public']['Tables']['media']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export type Video = Database['public']['Tables']['videos']['Row'];
export type VideoInsert = Database['public']['Tables']['videos']['Insert'];

export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export type Tag = Database['public']['Tables']['tags']['Row'];

export type SiteSettings = Database['public']['Tables']['settings']['Row'];
export type SiteSettingsUpdate = Database['public']['Tables']['settings']['Update'];

export type HomepageSection = Database['public']['Tables']['homepage_sections']['Row'];

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

export type MediaType = 'image' | 'video' | 'reel' | 'pdf' | 'document' | 'zip';

export type MediaStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface AppearanceConfig {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  headerStyle: 'transparent' | 'solid' | 'glass';
  footerText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgUrl: string | null;
  buttonStyle: 'rounded' | 'pill' | 'sharp';
  loaderStyle: 'spinner' | 'progress' | 'pulse';
  cursorEffects: boolean;
  socialLinks: {
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    github: string;
  };
  sectionOrder: string[];
}

export interface AnalyticsData {
  totalViews: number;
  totalMedia: number;
  totalUsers: number;
  totalDownloads: number;
  viewsTrend: { date: string; views: number }[];
  topMedia: { id: string; title: string; views: number; type: MediaType }[];
  recentActivity: { id: string; action: string; timestamp: string; user: string }[];
}
