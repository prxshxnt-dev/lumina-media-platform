export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'meinkxun@gmail.com';

export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  VIDEOS: 'videos',
  REELS: 'reels',
  DOCUMENTS: 'documents',
  THUMBNAILS: 'thumbnails',
  LOGOS: 'logos',
} as const;

export const MEDIA_TYPES = [
  { value: 'image', label: 'Image', icon: 'Image', accept: 'image/*' },
  { value: 'video', label: 'Video', icon: 'Video', accept: 'video/*' },
  { value: 'reel', label: 'Reel', icon: 'Film', accept: 'video/*' },
  { value: 'pdf', label: 'PDF', icon: 'FileText', accept: 'application/pdf' },
  { value: 'document', label: 'Document', icon: 'File', accept: '.doc,.docx,.txt' },
  { value: 'zip', label: 'ZIP Archive', icon: 'Archive', accept: '.zip,.rar,.7z' },
] as const;

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Videos', href: '/videos' },
  { label: 'Documents', href: '/documents' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const DEFAULT_APPEARANCE = {
  siteName: 'Lumina',
  logoUrl: null,
  faviconUrl: null,
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#ec4899',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  headerStyle: 'glass' as const,
  footerText: 'Premium media showcase platform',
  heroTitle: 'Where Every Story Comes to Life',
  heroSubtitle: 'Discover a curated collection of premium visual content — images, videos, reels, and documents crafted to inspire.',
  heroBgUrl: null,
  buttonStyle: 'rounded' as const,
  loaderStyle: 'pulse' as const,
  cursorEffects: true,
  socialLinks: {
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    github: 'https://prxsnt.vercel.app',
  },
  sectionOrder: ['hero', 'featured_videos', 'featured_images', 'categories', 'latest_uploads', 'trending', 'gallery_preview', 'about', 'testimonials', 'contact', 'newsletter'],
};

export const HOMEPAGE_SECTIONS = [
  { key: 'hero', title: 'Hero Section', subtitle: 'Main banner with title and CTA' },
  { key: 'featured_videos', title: 'Featured Videos', subtitle: 'Showcase selected videos' },
  { key: 'featured_images', title: 'Featured Images', subtitle: 'Highlight premium images' },
  { key: 'categories', title: 'Categories', subtitle: 'Browse by category' },
  { key: 'latest_uploads', title: 'Latest Uploads', subtitle: 'Recently added media' },
  { key: 'trending', title: 'Trending Media', subtitle: 'Most viewed content' },
  { key: 'gallery_preview', title: 'Gallery Preview', subtitle: 'Preview of the gallery' },
  { key: 'about', title: 'About', subtitle: 'About the platform' },
  { key: 'testimonials', title: 'Testimonials', subtitle: 'What people say' },
  { key: 'contact', title: 'Contact', subtitle: 'Get in touch' },
  { key: 'newsletter', title: 'Newsletter', subtitle: 'Email subscription' },
];

export const PAGE_SIZE = 12;
