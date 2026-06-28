import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          You don't have permission to access this area. Only authorized administrators can view this page.
        </p>
        <Link href="/" className="btn-primary inline-flex">Back to Home</Link>
      </div>
    </div>
  );
}
