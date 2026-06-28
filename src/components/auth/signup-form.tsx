'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Chrome, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signupSchema, type SignupInput } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SignupForm() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema) as any,
  });

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    try {
      const result = await signUpWithEmail(data.email, data.password, data.fullName);
      if (result.user) {
        toast.success('Account created! Please check your email to verify your account.');
        router.push('/auth/login');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign-up failed');
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Join our community of creators and viewers</p>

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
          <User className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
          <Input label="Full Name" placeholder="John Doe" className="pl-10" error={errors.fullName?.message} {...register('fullName')} />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
          <Input label="Email" type="email" placeholder="you@example.com" className="pl-10" error={errors.email?.message} {...register('email')} />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
          <Input label="Password" type="password" placeholder="••••••••" className="pl-10" error={errors.password?.message} {...register('password')} />
        </div>
        <Button type="submit" disabled={loading} className="w-full group">
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-500 hover:underline font-medium">Sign in</Link>
      </p>
    </motion.div>
  );
}
