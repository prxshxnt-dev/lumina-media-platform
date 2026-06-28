import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VideoLibrary } from '@/components/videos/video-library';
import { getSettings, getPublishedVideos, getFeaturedVideos, getCategories } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Video Library',
  description: 'Watch premium video content with our custom player, continue watching, and more.',
};

export default async function VideosPage() {
  const [settings, videosData, featured, categories] = await Promise.all([
    getSettings(),
    getPublishedVideos({ page: 1 }),
    getFeaturedVideos(),
    getCategories(),
  ]);

  return (
    <>
      <Header siteName={settings?.site_name} />
      <main className="pt-32 pb-20 min-h-screen">
        <VideoLibrary initialItems={videosData.items} featured={featured} categories={categories} total={videosData.total} />
      </main>
      <Footer siteName={settings?.site_name} footerText={settings?.footer_text} />
    </>
  );
}
