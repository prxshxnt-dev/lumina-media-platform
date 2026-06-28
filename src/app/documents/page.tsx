import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DocumentsView } from '@/components/gallery/documents-view';
import { getSettings, getPublishedDocuments, getCategories } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Browse and download premium documents, PDFs, and resources.',
};

export default async function DocumentsPage() {
  const [settings, docsData, categories] = await Promise.all([
    getSettings(),
    getPublishedDocuments({ page: 1 }),
    getCategories(),
  ]);

  return (
    <>
      <Header siteName={settings?.site_name} />
      <main className="pt-32 pb-20 min-h-screen">
        <DocumentsView initialItems={docsData.items} categories={categories} total={docsData.total} />
      </main>
      <Footer siteName={settings?.site_name} footerText={settings?.footer_text} />
    </>
  );
}
