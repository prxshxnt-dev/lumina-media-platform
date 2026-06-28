import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DashboardView } from '@/components/admin/dashboard-view';
import { getSettings, getCurrentUser } from '@/lib/queries';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const settings = await getSettings();

  return (
    <>
      <Header siteName={settings?.site_name} />
      <main className="pt-32 pb-20 min-h-screen">
        <DashboardView user={user} />
      </main>
      <Footer siteName={settings?.site_name} footerText={settings?.footer_text} />
    </>
  );
}
