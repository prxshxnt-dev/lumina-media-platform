-- ============================================================================
-- LUMINA MEDIA PLATFORM — Supabase Migration
-- Complete database schema with Row Level Security (RLS)
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ospc";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Set super_admin if email matches admin email
  IF new.email = 'meinkxun@gmail.com' THEN
    UPDATE public.profiles SET role = 'super_admin' WHERE id = new.id;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

-- ============================================================================
-- MEDIA TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'reel', 'pdf', 'document', 'zip')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  file_format TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_downloadable BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published media is viewable by everyone" ON public.media FOR SELECT
  USING (status = 'published' OR created_by = auth.uid());
CREATE POLICY "Only admins can insert media" ON public.media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );
CREATE POLICY "Only admins can update media" ON public.media FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );
CREATE POLICY "Only admins can delete media" ON public.media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Increment views function
CREATE OR REPLACE FUNCTION public.increment_media_views(media_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.media SET views = views + 1 WHERE id = media_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Toggle like function
CREATE OR REPLACE FUNCTION public.toggle_media_like(media_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.media SET likes = likes + 1 WHERE id = media_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VIDEOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_downloadable BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  quality TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published videos are viewable by everyone" ON public.videos FOR SELECT
  USING (status = 'published' OR created_by = auth.uid());
CREATE POLICY "Only admins can insert videos" ON public.videos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );
CREATE POLICY "Only admins can update videos" ON public.videos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );
CREATE POLICY "Only admins can delete videos" ON public.videos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Increment video views function
CREATE OR REPLACE FUNCTION public.increment_video_views(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.videos SET views = views + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Toggle video like function
CREATE OR REPLACE FUNCTION public.toggle_video_like(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.videos SET likes = likes + 1 WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  is_downloadable BOOLEAN NOT NULL DEFAULT true,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published documents are viewable by everyone" ON public.documents FOR SELECT
  USING (status = 'published' OR created_by = auth.uid());
CREATE POLICY "Only admins can insert documents" ON public.documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );
CREATE POLICY "Only admins can update documents" ON public.documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );
CREATE POLICY "Only admins can delete documents" ON public.documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

-- Increment document downloads function
CREATE OR REPLACE FUNCTION public.increment_document_downloads(doc_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.documents SET downloads = downloads + 1 WHERE id = doc_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TAGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Only admins can manage tags" ON public.tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')));

-- ============================================================================
-- SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'Lumina',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#6366f1',
  secondary_color TEXT NOT NULL DEFAULT '#8b5cf6',
  accent_color TEXT NOT NULL DEFAULT '#ec4899',
  font_heading TEXT NOT NULL DEFAULT 'Inter',
  font_body TEXT NOT NULL DEFAULT 'Inter',
  header_style TEXT NOT NULL DEFAULT 'glass' CHECK (header_style IN ('transparent', 'solid', 'glass')),
  footer_text TEXT NOT NULL DEFAULT 'Premium media showcase platform',
  hero_title TEXT NOT NULL DEFAULT 'Where Every Story Comes to Life',
  hero_subtitle TEXT NOT NULL DEFAULT 'Discover a curated collection of premium visual content.',
  hero_bg_url TEXT,
  button_style TEXT NOT NULL DEFAULT 'rounded' CHECK (button_style IN ('rounded', 'pill', 'sharp')),
  loader_style TEXT NOT NULL DEFAULT 'pulse' CHECK (loader_style IN ('spinner', 'progress', 'pulse')),
  cursor_effects BOOLEAN NOT NULL DEFAULT true,
  social_twitter TEXT DEFAULT '',
  social_instagram TEXT DEFAULT '',
  social_youtube TEXT DEFAULT '',
  social_linkedin TEXT DEFAULT '',
  social_github TEXT DEFAULT 'https://prxsnt.vercel.app',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Only super_admin can update settings" ON public.settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Only super_admin can insert settings" ON public.settings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Insert default settings
INSERT INTO public.settings (site_name) VALUES ('Lumina')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- HOMEPAGE SECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  section_title TEXT NOT NULL,
  section_subtitle TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homepage sections are viewable by everyone" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "Only admins can manage homepage sections" ON public.homepage_sections FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- Insert default sections
INSERT INTO public.homepage_sections (section_key, section_title, section_subtitle, sort_order) VALUES
  ('hero', 'Hero Section', 'Main banner', 0),
  ('featured_videos', 'Featured Videos', 'Spotlight videos', 1),
  ('featured_images', 'Featured Images', 'Highlight images', 2),
  ('categories', 'Categories', 'Browse categories', 3),
  ('latest_uploads', 'Latest Uploads', 'Recent additions', 4),
  ('trending', 'Trending Media', 'Popular content', 5),
  ('gallery_preview', 'Gallery Preview', 'Gallery glimpse', 6),
  ('about', 'About', 'About section', 7),
  ('testimonials', 'Testimonials', 'What people say', 8),
  ('contact', 'Contact', 'Get in touch', 9),
  ('newsletter', 'Newsletter', 'Subscribe', 10)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================================
-- ANALYTICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'download', 'like', 'share', 'upload', 'login', 'signup')),
  entity_id UUID,
  entity_type TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert analytics events" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view analytics" ON public.analytics FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Users can insert audit logs" ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible testimonials are viewable by everyone" ON public.testimonials FOR SELECT
  USING (is_visible = true);
CREATE POLICY "Only admins can manage testimonials" ON public.testimonials FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- ============================================================================
-- NEWSLETTER TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view newsletter" ON public.newsletter FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('images', 'images', true),
  ('videos', 'videos', true),
  ('reels', 'reels', true),
  ('documents', 'documents', true),
  ('thumbnails', 'thumbnails', true),
  ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access to images" ON storage.objects FOR SELECT
  USING (bucket_id IN ('images', 'videos', 'reels', 'documents', 'thumbnails', 'logos'));
CREATE POLICY "Authenticated users can upload to storage" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('images', 'videos', 'reels', 'documents', 'thumbnails', 'logos')
    AND auth.role() = 'authenticated'
  );
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('images', 'videos', 'reels', 'documents', 'thumbnails', 'logos')
    AND auth.uid() = owner
  );

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- REALTIME
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.media;
ALTER PUBLICATION supabase_realtime ADD TABLE public.videos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_sections;

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_media_status ON public.media(status);
CREATE INDEX idx_media_type ON public.media(type);
CREATE INDEX idx_media_category ON public.media(category_id);
CREATE INDEX idx_media_featured ON public.media(is_featured);
CREATE INDEX idx_media_published_at ON public.media(published_at DESC);
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_videos_featured ON public.videos(is_featured);
CREATE INDEX idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_analytics_entity ON public.analytics(entity_id, entity_type);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
