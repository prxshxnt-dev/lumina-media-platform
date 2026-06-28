'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { resetPasswordSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(resetPasswordSchema) as any,
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
      <Link href="/" className="text-2xl font-bold gradient-text mb-8 inline-block">Lumina</Link>
      {sent ? (
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">We&apos;ve sent a password reset link to your email address.</p>
          <Link href="/auth/login" className="btn-primary inline-flex">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your email and we&apos;ll send you a reset link</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
              <Input label="Email" type="email" placeholder="you@example.com" className="pl-10" error={errors.email?.message} {...register('email')} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <Link href="/auth/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-brand-500 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </>
      )}
    </motion.div>
  );
}
