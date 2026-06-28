export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'super_admin' | 'admin' | 'editor' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'super_admin' | 'admin' | 'editor' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'super_admin' | 'admin' | 'editor' | 'viewer';
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: 'image' | 'video' | 'reel' | 'pdf' | 'document' | 'zip';
          url: string;
          thumbnail_url: string | null;
          file_size: number | null;
          file_format: string | null;
          category_id: string | null;
          tags: string[] | null;
          status: 'draft' | 'published' | 'scheduled' | 'archived';
          is_featured: boolean;
          is_downloadable: boolean;
          views: number;
          downloads: number;
          likes: number;
          published_at: string | null;
          scheduled_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: 'image' | 'video' | 'reel' | 'pdf' | 'document' | 'zip';
          url: string;
          thumbnail_url?: string | null;
          file_size?: number | null;
          file_format?: string | null;
          category_id?: string | null;
          tags?: string[] | null;
          status?: 'draft' | 'published' | 'scheduled' | 'archived';
          is_featured?: boolean;
          is_downloadable?: boolean;
          views?: number;
          downloads?: number;
          likes?: number;
          published_at?: string | null;
          scheduled_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: 'image' | 'video' | 'reel' | 'pdf' | 'document' | 'zip';
          url?: string;
          thumbnail_url?: string | null;
          file_size?: number | null;
          file_format?: string | null;
          category_id?: string | null;
          tags?: string[] | null;
          status?: 'draft' | 'published' | 'scheduled' | 'archived';
          is_featured?: boolean;
          is_downloadable?: boolean;
          views?: number;
          downloads?: number;
          likes?: number;
          published_at?: string | null;
          scheduled_at?: string | null;
          updated_at?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          parent_id: string | null;
          sort_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          video_url: string;
          thumbnail_url: string | null;
          duration: number | null;
          category_id: string | null;
          tags: string[] | null;
          status: 'draft' | 'published' | 'scheduled';
          is_featured: boolean;
          is_downloadable: boolean;
          views: number;
          likes: number;
          quality: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          video_url: string;
          thumbnail_url?: string | null;
          duration?: number | null;
          category_id?: string | null;
          tags?: string[] | null;
          status?: 'draft' | 'published' | 'scheduled';
          is_featured?: boolean;
          is_downloadable?: boolean;
          views?: number;
          likes?: number;
          quality?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          video_url?: string;
          thumbnail_url?: string | null;
          duration?: number | null;
          category_id?: string | null;
          tags?: string[] | null;
          status?: 'draft' | 'published' | 'scheduled';
          is_featured?: boolean;
          is_downloadable?: boolean;
          views?: number;
          likes?: number;
          quality?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string;
          file_size: number | null;
          category_id: string | null;
          status: 'draft' | 'published' | 'scheduled';
          is_downloadable: boolean;
          downloads: number;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          file_url: string;
          file_type: string;
          file_size?: number | null;
          category_id?: string | null;
          status?: 'draft' | 'published' | 'scheduled';
          is_downloadable?: boolean;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string;
          file_size?: number | null;
          category_id?: string | null;
          status?: 'draft' | 'published' | 'scheduled';
          is_downloadable?: boolean;
          downloads?: number;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          site_name: string;
          logo_url: string | null;
          favicon_url: string | null;
          primary_color: string;
          secondary_color: string;
          accent_color: string;
          font_heading: string;
          font_body: string;
          header_style: 'transparent' | 'solid' | 'glass';
          footer_text: string;
          hero_title: string;
          hero_subtitle: string;
          hero_bg_url: string | null;
          button_style: 'rounded' | 'pill' | 'sharp';
          loader_style: 'spinner' | 'progress' | 'pulse';
          cursor_effects: boolean;
          social_twitter: string;
          social_instagram: string;
          social_youtube: string;
          social_linkedin: string;
          social_github: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name: string;
          logo_url?: string | null;
          favicon_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          accent_color?: string;
          font_heading?: string;
          font_body?: string;
          header_style?: 'transparent' | 'solid' | 'glass';
          footer_text?: string;
          hero_title?: string;
          hero_subtitle?: string;
          hero_bg_url?: string | null;
          button_style?: 'rounded' | 'pill' | 'sharp';
          loader_style?: 'spinner' | 'progress' | 'pulse';
          cursor_effects?: boolean;
          social_twitter?: string;
          social_instagram?: string;
          social_youtube?: string;
          social_linkedin?: string;
          social_github?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_name?: string;
          logo_url?: string | null;
          favicon_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          accent_color?: string;
          font_heading?: string;
          font_body?: string;
          header_style?: 'transparent' | 'solid' | 'glass';
          footer_text?: string;
          hero_title?: string;
          hero_subtitle?: string;
          hero_bg_url?: string | null;
          button_style?: 'rounded' | 'pill' | 'sharp';
          loader_style?: 'spinner' | 'progress' | 'pulse';
          cursor_effects?: boolean;
          social_twitter?: string;
          social_instagram?: string;
          social_youtube?: string;
          social_linkedin?: string;
          social_github?: string;
          updated_at?: string;
        };
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          section_title: string;
          section_subtitle: string | null;
          is_visible: boolean;
          sort_order: number;
          config: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          section_title: string;
          section_subtitle?: string | null;
          is_visible?: boolean;
          sort_order?: number;
          config?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          section_title?: string;
          section_subtitle?: string | null;
          is_visible?: boolean;
          sort_order?: number;
          config?: Record<string, unknown> | null;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          event_type: 'view' | 'download' | 'like' | 'share' | 'upload' | 'login' | 'signup';
          entity_id: string | null;
          entity_type: string | null;
          user_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: 'view' | 'download' | 'like' | 'share' | 'upload' | 'login' | 'signup';
          entity_id?: string | null;
          entity_type?: string | null;
          user_id?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: 'view' | 'download' | 'like' | 'share' | 'upload' | 'login' | 'signup';
          entity_id?: string | null;
          entity_type?: string | null;
          user_id?: string | null;
          metadata?: Record<string, unknown> | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          user_email: string;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          details: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_email: string;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          details?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_email?: string;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          details?: Record<string, unknown> | null;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          avatar_url: string | null;
          content: string;
          rating: number;
          is_visible: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          avatar_url?: string | null;
          content: string;
          rating?: number;
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          avatar_url?: string | null;
          content?: string;
          rating?: number;
          is_visible?: boolean;
          sort_order?: number;
        };
      };
      newsletter: {
        Row: {
          id: string;
          email: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          is_active?: boolean;
        };
      };
    };
  };
}
