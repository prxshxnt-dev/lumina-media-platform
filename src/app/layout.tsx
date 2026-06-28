import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/providers/toaster';
import { CustomCursor } from '@/components/layout/custom-cursor';
import { getSettings } from '@/lib/queries';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings?.site_name || 'Lumina';
  const description = settings?.hero_subtitle || 'Premium media showcase platform';

  return {
    title: { default: `${siteName} — Premium Media Platform`, template: `%s | ${siteName}` },
    description,
    keywords: ['media', 'gallery', 'videos', 'portfolio', 'showcase', 'photography'],
    authors: [{ name: 'Prashant Kumar' }],
    creator: 'Prashant Kumar',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: `${siteName} — Premium Media Platform`,
      description,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} — Premium Media Platform`,
      description,
    },
    robots: { index: true, follow: true },
    icons: settings?.favicon_url ? [{ url: settings.favicon_url }] : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider>
          <QueryProvider>
            {settings?.cursor_effects !== false && <CustomCursor />}
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
