import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { getCurrentUser, getSettings } from '@/lib/queries';
import { ADMIN_EMAIL } from '@/lib/constants';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?redirect=/admin');
  if (user.email !== ADMIN_EMAIL) redirect('/unauthorized');

  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <AdminSidebar siteName={settings?.site_name || 'Lumina'} userEmail={user.email} />
      <div className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
