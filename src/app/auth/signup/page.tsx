import type { Metadata } from 'next';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Lumina account.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 text-white p-12 max-w-md">
          <h1 className="text-4xl font-bold mb-4">Join Lumina</h1>
          <p className="text-white/80 text-lg">Create an account to start uploading, sharing, and managing your premium media content.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950">
        <SignupForm />
      </div>
    </div>
  );
}
