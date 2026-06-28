import { cn } from '@/lib/utils';
import { Reveal } from './reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, center, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn('mb-12', center && 'text-center', className)}>
      {eyebrow && (
        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-500 mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg text-gray-500 dark:text-gray-400 text-balance', center && 'mx-auto max-w-2xl')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
