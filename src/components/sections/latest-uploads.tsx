'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Clock, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { formatNumber, timeAgo } from '@/lib/utils';
import type { Media } from '@/types';

export function LatestUploads({ items }: { items: Media[] }) {
  if (!items.length) return null;
  return (
    <section className="section-padding bg-gray-50/50 dark:bg-gray-950/50">
      <div className="container-max">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Fresh"
            title="Latest Uploads"
            subtitle="The newest additions to our growing media library."
            className="mb-0"
          />
          <Link href="/gallery" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 8).map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <motion.div whileHover={{ y: -6 }} className="group rounded-2xl overflow-hidden bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {item.thumbnail_url && (
                    <img src={item.thumbnail_url || item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  )}
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium glass-strong capitalize">{item.type}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(item.created_at)}</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
