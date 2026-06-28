'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { formatNumber } from '@/lib/utils';
import type { Media } from '@/types';

export function FeaturedImages({ items }: { items: Media[] }) {
  if (!items.length) return null;
  return (
    <section className="section-padding bg-gray-50/50 dark:bg-gray-950/50">
      <div className="container-max">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Visuals"
            title="Featured Images"
            subtitle="A stunning collection of curated photography and visual art."
            className="mb-0"
          />
          <Link href="/gallery" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.slice(0, 8).map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6 }}
                className={`group relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer ${i % 3 === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}
              >
                {item.thumbnail_url && (
                  <img
                    src={item.thumbnail_url || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-medium text-sm line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes)}</span>
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
