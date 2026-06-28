'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Image, Video, FileText, Eye, Heart, Download, TrendingUp, Clock } from 'lucide-react';
import { useMedia, useFeaturedMedia } from '@/hooks/use-media';
import { useVideos } from '@/hooks/use-videos';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, timeAgo } from '@/lib/utils';
import type { UserProfile } from '@/types';

export function DashboardView({ user }: { user: UserProfile }) {
  const { data: mediaData, isLoading: mediaLoading } = useMedia({ page: 1 });
  const { data: videoData, isLoading: videoLoading } = useVideos({ page: 1 });

  const totalViews = (mediaData?.items ?? []).reduce((sum, m) => sum + m.views, 0) + (videoData?.items ?? []).reduce((sum, v) => sum + v.views, 0);
  const totalLikes = (mediaData?.items ?? []).reduce((sum, m) => sum + m.likes, 0) + (videoData?.items ?? []).reduce((sum, v) => sum + v.likes, 0);
  const totalDownloads = (mediaData?.items ?? []).reduce((sum, m) => sum + m.downloads, 0);

  const stats = [
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Likes', value: totalLikes, icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Downloads', value: totalDownloads, icon: Download, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Media Items', value: mediaData?.total ?? 0, icon: Image, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="container-max px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.full_name || user.email}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's an overview of your account activity</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <AnimatedCounter value={stat.value} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Media</h2>
          {mediaLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(mediaData?.items ?? []).slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {item.thumbnail_url && <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Videos</h2>
          {videoLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(videoData?.items ?? []).slice(0, 5).map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                      {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{video.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(video.views)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
