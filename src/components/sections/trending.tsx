'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Heart } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { formatNumber } from '@/lib/utils';
import type { Media } from '@/types';

export function Trending({ items }: { items: Media[] }) {
  if (!items.length) return null;
  return (
    <section className="section-padding">
      <div className="container-max">
        <SectionHeading
          eyebrow="Popular"
          title="Trending Now"
          subtitle="The most viewed and loved content on our platform right now."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.slice(0, 6).map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <Link href="/gallery">
                <motion.div whileHover={{ x: 4 }} className="group flex gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {item.thumbnail_url && (
                      <img src={item.thumbnail_url || item.url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                    )}
                    <span className="absolute top-2 left-2 w-6 h-6 rounded-full glass-strong flex items-center justify-center text-xs font-bold text-brand-500">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-xs text-brand-500 font-medium mb-1">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes)}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
