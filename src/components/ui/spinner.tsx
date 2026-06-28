import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className, size = 24 }: { className?: string; size?: number }) {
  return <Loader2 className={cn('animate-spin text-brand-500', className)} size={size} />;
}
