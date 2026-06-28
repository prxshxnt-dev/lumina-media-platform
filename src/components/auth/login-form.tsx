'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Chrome, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as any,
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast.success('Welcome back!');
      const redirect = params.get('redirect') || '/dashboard';
      router.push(redirect);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <Link href="/" className="text-2xl font-bold gradient-text mb-8 inline-block">Lumina</Link>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your credentials to access your account</p>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium text-sm disabled:opacity-50"
      >
        <Chrome className="w-5 h-5" />
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
          <Input label="Email" type="email" placeholder="you@example.com" className="pl-10" error={errors.email?.message} {...register('email')} />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
          <Input label="Password" type="password" placeholder="••••••••" className="pl-10" error={errors.password?.message} {...register('password')} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700" /> Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-brand-500 hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" disabled={loading} className="w-full group">
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-brand-500 hover:underline font-medium">Sign up</Link>
      </p>
    </motion.div>
  );
}
