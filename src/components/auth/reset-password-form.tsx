'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { newPasswordSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ResetPasswordForm() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(newPasswordSchema) as any,
  });

  const onSubmit = async (data: { password: string }) => {
    setLoading(true);
    try {
      await updatePassword(data.password);
      toast.success('Password updated successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
      <Link href="/" className="text-2xl font-bold gradient-text mb-8 inline-block">Lumina</Link>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set New Password</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your new password below</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
          <Input label="New Password" type="password" placeholder="••••••••" className="pl-10" error={errors.password?.message} {...register('password')} />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
          <Input label="Confirm Password" type="password" placeholder="••••••••" className="pl-10" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        </div>
        <Button type="submit" disabled={loading} className="w-full group">
          {loading ? 'Updating...' : 'Update Password'}
          {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>
    </motion.div>
  );
}
