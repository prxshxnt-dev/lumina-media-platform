'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  content: string;
  rating: number;
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="section-padding bg-gray-50/50 dark:bg-gray-950/50">
      <div className="container-max">
        <SectionHeading
          eyebrow="Testimonials"
          title="What People Say"
          subtitle="Trusted by creators and viewers around the world."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(0, 6).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 h-full flex flex-col"
              >
                <Quote className="w-8 h-8 text-brand-500/30 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 flex-1">{t.content}</p>
                <div className="flex items-center gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'}`} />
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
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
