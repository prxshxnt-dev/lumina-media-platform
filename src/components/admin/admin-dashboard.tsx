'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Image, Video, FileText, Eye, Heart, Download, Users, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { useMedia } from '@/hooks/use-media';
import { useVideos } from '@/hooks/use-videos';
import { useCategories } from '@/hooks/use-categories';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, timeAgo } from '@/lib/utils';

export function AdminDashboard() {
  const { data: mediaData, isLoading: mediaLoading } = useMedia({ page: 1 });
  const { data: videoData } = useVideos({ page: 1 });
  const { data: categories } = useCategories();

  const totalViews = (mediaData?.items ?? []).reduce((s, m) => s + m.views, 0) + (videoData?.items ?? []).reduce((s, v) => s + v.views, 0);
  const totalLikes = (mediaData?.items ?? []).reduce((s, m) => s + m.likes, 0) + (videoData?.items ?? []).reduce((s, v) => s + v.likes, 0);
  const totalDownloads = (mediaData?.items ?? []).reduce((s, m) => s + m.downloads, 0);

  const stats = [
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Likes', value: totalLikes, icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Downloads', value: totalDownloads, icon: Download, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Media Items', value: mediaData?.total ?? 0, icon: Image, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Videos', value: videoData?.total ?? 0, icon: Video, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Categories', value: categories?.length ?? 0, icon: Users, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your media platform</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Media</h2>
            <Link href="/admin/media" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {mediaLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : (
            <div className="space-y-2">
              {(mediaData?.items ?? []).slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                    {item.thumbnail_url && <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{item.type}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>
                      <span>{timeAgo(item.created_at)}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Upload Media', href: '/admin/media', icon: Image },
              { label: 'Add Video', href: '/admin/videos', icon: Video },
              { label: 'Add Document', href: '/admin/documents', icon: FileText },
              { label: 'Manage Categories', href: '/admin/categories', icon: Users },
              { label: 'Edit Appearance', href: '/admin/appearance', icon: Activity },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <action.icon className="w-4 h-4 text-brand-500" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
