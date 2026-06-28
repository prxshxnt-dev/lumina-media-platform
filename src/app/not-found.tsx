import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex group">
          <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
