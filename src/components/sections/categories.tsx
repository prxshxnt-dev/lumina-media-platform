'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ImageIcon, Video, Film, FileText, Archive, Folder } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import type { Category } from '@/types';

const iconMap: Record<string, typeof ImageIcon> = {
  ImageIcon, Video, Film, FileText, Archive, Folder,
};

export function Categories({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  return (
    <section className="section-padding">
      <div className="container-max">
        <SectionHeading
          eyebrow="Browse"
          title="Explore Categories"
          subtitle="Find exactly what you're looking for across our organized collections."
          center
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon || ''] || Folder;
            return (
              <Reveal key={cat.id} delay={i * 0.05}>
                <Link href={`/gallery?category=${cat.id}`}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer h-full"
                  >
                    <div
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: cat.color || '#6366f1' }}
                    />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${cat.color || '#6366f1'}20`, color: cat.color || '#6366f1' }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                    {cat.description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{cat.description}</p>
                    )}
                  </motion.div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
