import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { FeaturedVideos } from '@/components/sections/featured-videos';
import { FeaturedImages } from '@/components/sections/featured-images';
import { Categories } from '@/components/sections/categories';
import { LatestUploads } from '@/components/sections/latest-uploads';
import { Trending } from '@/components/sections/trending';
import { GalleryPreview } from '@/components/sections/gallery-preview';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';
import { Newsletter } from '@/components/sections/newsletter';
import {
  getSettings,
  getHomepageSections,
  getFeaturedMedia,
  getFeaturedVideos,
  getTrendingMedia,
  getLatestUploads,
  getCategories,
  getPublishedMedia,
  getTestimonials,
} from '@/lib/queries';

export default async function HomePage() {
  const [settings, sections, featuredVideos, featuredImages, trending, latest, categories, galleryItems, testimonials] = await Promise.all([
    getSettings(),
    getHomepageSections(),
    getFeaturedVideos(),
    getFeaturedMedia('image'),
    getTrendingMedia(),
    getLatestUploads(),
    getCategories(),
    getPublishedMedia({ page: 1 }),
    getTestimonials(),
  ]);

  const siteName = settings?.site_name || 'Lumina';
  const sectionMap = new Map(sections.map((s) => [s.section_key, s]));
  const order = sections.length > 0
    ? sections.filter((s) => s.is_visible).map((s) => s.section_key)
    : ['hero', 'featured_videos', 'featured_images', 'categories', 'latest_uploads', 'trending', 'gallery_preview', 'about', 'testimonials', 'contact', 'newsletter'];

  const sectionComponents: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" title={settings?.hero_title} subtitle={settings?.hero_subtitle} bgUrl={settings?.hero_bg_url} />,
    featured_videos: <FeaturedVideos key="fv" videos={featuredVideos} />,
    featured_images: <FeaturedImages key="fi" items={featuredImages} />,
    categories: <Categories key="cat" categories={categories} />,
    latest_uploads: <LatestUploads key="lu" items={latest} />,
    trending: <Trending key="tr" items={trending} />,
    gallery_preview: <GalleryPreview key="gp" items={galleryItems.items} />,
    about: <About key="about" />,
    testimonials: <Testimonials key="test" items={testimonials} />,
    contact: <Contact key="contact" />,
    newsletter: <Newsletter key="news" />,
  };

  return (
    <>
      <Header siteName={siteName} />
      <main>
        {order.map((key) => sectionComponents[key] ?? null)}
      </main>
      <Footer
        siteName={siteName}
        footerText={settings?.footer_text}
        socialLinks={{
          twitter: settings?.social_twitter,
          instagram: settings?.social_instagram,
          youtube: settings?.social_youtube,
          linkedin: settings?.social_linkedin,
          github: settings?.social_github,
        }}
      />
    </>
  );
}
