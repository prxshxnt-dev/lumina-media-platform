'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Search, Grid3x3, Layout, X, Eye, Heart, Download } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';
import { useMedia } from '@/hooks/use-media';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';
import type { Media, Category } from '@/types';
import 'react-photo-view/dist/react-photo-view.css';

interface GalleryViewProps {
  initialItems: Media[];
  categories: Category[];
  total: number;
}

export function GalleryView({ initialItems, categories, total }: GalleryViewProps) {
  const supabase = useSupabase();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [layout, setLayout] = useState<'masonry' | 'grid'>('masonry');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'liked'>('newest');
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<Media[]>(initialItems);

  const { data, isLoading } = useMedia({ category: activeCategory || undefined, search: search || undefined, page });

  const filtered = useMemo(() => {
    let items = (data?.items ?? allItems) as Media[];
    if (sortBy === 'popular') items = [...items].sort((a, b) => b.views - a.views);
    if (sortBy === 'liked') items = [...items].sort((a, b) => b.likes - a.likes);
    return items;
  }, [data, allItems, sortBy]);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
    if (data?.items) {
      setAllItems((prev) => [...prev, ...data.items]);
    }
  }, [data]);

  const photos = filtered.map((item) => ({
    src: item.thumbnail_url || item.url,
    key: item.id,
  }));

  return (
    <div className="container-max px-4 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Gallery</h1>
        <p className="text-gray-500 dark:text-gray-400">{total} items in our collection</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setLayout('masonry')} className={`p-3 rounded-xl border transition-colors ${layout === 'masonry' ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
              <Layout className="w-5 h-5" />
            </button>
            <button onClick={() => setLayout('grid')} className={`p-3 rounded-xl border transition-colors ${layout === 'grid' ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-200 dark:border-gray-800'}`}>
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveCategory(null); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
          {(['newest', 'popular', 'liked'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors ${sortBy === s ? 'text-brand-500 bg-brand-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      {isLoading && page === 1 ? (
        <div className={layout === 'masonry' ? 'masonry-grid' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={layout === 'masonry' ? 'masonry-item' : 'aspect-square'} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No items found. Try adjusting your filters.</p>
        </div>
      ) : (
        <PhotoProvider>
          {layout === 'masonry' ? (
            <div className="masonry-grid">
              {filtered.map((item) => (
                <div key={item.id} className="masonry-item group relative">
                  <PhotoView src={item.thumbnail_url || item.url}>
                    <div className="relative rounded-xl overflow-hidden cursor-pointer bg-gray-200 dark:bg-gray-800">
                      <img src={item.thumbnail_url || item.url} alt={item.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes)}</span>
                        </div>
                      </div>
                      <Badge className="absolute top-3 left-3 capitalize" variant="primary">{item.type}</Badge>
                    </div>
                  </PhotoView>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <PhotoView key={item.id} src={item.thumbnail_url || item.url}>
                  <div className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-200 dark:bg-gray-800">
                    <img src={item.thumbnail_url || item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
                    </div>
                  </div>
                </PhotoView>
              ))}
            </div>
          )}
        </PhotoProvider>
      )}

      {/* Load More */}
      {filtered.length > 0 && filtered.length < total && (
        <div className="text-center mt-10">
          <Button onClick={loadMore} variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}
