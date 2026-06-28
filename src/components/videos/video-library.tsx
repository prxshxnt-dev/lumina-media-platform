'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Play, Eye, Heart, Clock } from 'lucide-react';
import { useVideos } from '@/hooks/use-videos';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeading } from '@/components/ui/section-heading';
import { formatNumber } from '@/lib/utils';
import type { Video, Category } from '@/types';

interface VideoLibraryProps {
  initialItems: Video[];
  featured: Video[];
  categories: Category[];
  total: number;
}

export function VideoLibrary({ initialItems, featured, categories, total }: VideoLibraryProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useVideos({ search: search || undefined, page });

  const items = data?.items ?? initialItems;

  return (
    <div className="container-max px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Video Library</h1>
        <p className="text-gray-500 dark:text-gray-400">{total} videos available</p>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-12">
          <SectionHeading eyebrow="Spotlight" title="Featured Videos" className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 3).map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/videos/${video.id}`}>
                  <motion.div whileHover={{ y: -6 }} className="group relative rounded-2xl overflow-hidden aspect-video bg-gray-200 dark:bg-gray-800 cursor-pointer">
                    {video.thumbnail_url && (
                      <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-semibold text-lg line-clamp-1">{video.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{formatNumber(video.views)}</span>
                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{formatNumber(video.likes)}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Video Grid */}
      {isLoading && page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No videos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/videos/${video.id}`}>
                <motion.div whileHover={{ y: -6 }} className="group rounded-2xl overflow-hidden bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                  <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {video.thumbnail_url && (
                      <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    {video.duration && (
                      <span className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-xs font-medium glass-strong text-white">
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{video.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(video.views)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(video.likes)}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {items.length > 0 && items.length < total && (
        <div className="text-center mt-10">
          <button onClick={() => setPage((p) => p + 1)} className="btn-secondary">Load More</button>
        </div>
      )}
    </div>
  );
}
