import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Contact } from '@/components/sections/contact';
import { getSettings } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Lumina team.',
};

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <Header siteName={settings?.site_name} />
      <main className="pt-32 pb-20 min-h-screen">
        <Contact />
      </main>
      <Footer siteName={settings?.site_name} footerText={settings?.footer_text} />
    </>
  );
}
