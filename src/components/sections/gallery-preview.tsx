'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import type { Media } from '@/types';

export function GalleryPreview({ items }: { items: Media[] }) {
  if (!items.length) return null;
  return (
    <section className="section-padding bg-gray-50/50 dark:bg-gray-950/50">
      <div className="container-max">
        <SectionHeading
          eyebrow="Gallery"
          title="A Glimpse of Our Gallery"
          subtitle="Explore the full collection with our advanced gallery viewer."
          center
        />
        <Reveal>
          <div className="masonry-grid">
            {items.slice(0, 8).map((item) => (
              <div key={item.id} className="masonry-item">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 group cursor-pointer"
                >
                  {item.thumbnail_url && (
                    <img src={item.thumbnail_url || item.url} alt={item.title} className="w-full object-cover" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="text-center mt-10">
          <Link href="/gallery" className="btn-primary inline-flex group">
            View Full Gallery
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
