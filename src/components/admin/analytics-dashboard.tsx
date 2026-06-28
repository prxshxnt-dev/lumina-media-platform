'use client';

import { motion } from 'framer-motion';
import { Eye, Heart, Download, TrendingUp, Users, Activity } from 'lucide-react';
import { useMedia } from '@/hooks/use-media';
import { useVideos } from '@/hooks/use-videos';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/utils';

export function AnalyticsDashboard() {
  const { data: mediaData, isLoading } = useMedia({ page: 1 });
  const { data: videoData } = useVideos({ page: 1 });

  const mediaItems = mediaData?.items ?? [];
  const videoItems = videoData?.items ?? [];

  const totalViews = mediaItems.reduce((s, m) => s + m.views, 0) + videoItems.reduce((s, v) => s + v.views, 0);
  const totalLikes = mediaItems.reduce((s, m) => s + m.likes, 0) + videoItems.reduce((s, v) => s + v.likes, 0);
  const totalDownloads = mediaItems.reduce((s, m) => s + m.downloads, 0);

  const topMedia = [...mediaItems].sort((a, b) => b.views - a.views).slice(0, 5);

  const stats = [
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Likes', value: totalLikes, icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Downloads', value: totalDownloads, icon: Download, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Media', value: mediaData?.total ?? 0, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your platform's performance</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white"><AnimatedCounter value={stat.value} /></div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-500" /> Top Performing Media
          </h2>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="space-y-3">
              {topMedia.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-300 dark:text-gray-700 w-6">{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {item.thumbnail_url && <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatNumber(item.views)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" /> Media by Type
          </h2>
          <div className="space-y-3">
            {['image', 'video', 'reel', 'pdf', 'document'].map((type) => {
              const count = mediaItems.filter((m) => m.type === type).length;
              const pct = mediaItems.length > 0 ? (count / mediaItems.length) * 100 : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
                    <span className="text-gray-500 dark:text-gray-400">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full bg-brand-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
