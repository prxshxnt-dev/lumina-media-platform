import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { GalleryView } from '@/components/gallery/gallery-view';
import { getSettings, getCategories, getPublishedMedia } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse our premium media gallery with advanced filtering, masonry grid, and fullscreen viewer.',
};

export default async function GalleryPage() {
  const [settings, categories, initialData] = await Promise.all([
    getSettings(),
    getCategories(),
    getPublishedMedia({ page: 1 }),
  ]);

  return (
    <>
      <Header siteName={settings?.site_name} />
      <main className="pt-32 pb-20 min-h-screen">
        <GalleryView initialItems={initialData.items} categories={categories} total={initialData.total} />
      </main>
      <Footer siteName={settings?.site_name} footerText={settings?.footer_text} />
    </>
  );
}
