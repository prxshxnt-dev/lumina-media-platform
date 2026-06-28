import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { About } from '@/components/sections/about';
import { getSettings } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Lumina — a premium media showcase platform.',
};

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <Header siteName={settings?.site_name} />
      <main className="pt-32 pb-20 min-h-screen">
        <About />
      </main>
      <Footer siteName={settings?.site_name} footerText={settings?.footer_text} />
    </>
  );
}
