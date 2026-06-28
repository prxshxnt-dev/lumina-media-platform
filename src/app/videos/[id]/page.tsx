import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VideoPlayer } from '@/components/videos/video-player';
import { getSettings, getVideoById, getRelatedVideos, getCategories } from '@/lib/queries';
import { formatNumber, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Eye, Heart, Calendar, Tag, Play } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const video = await getVideoById(params.id);
  if (!video) return { title: 'Video Not Found' };
  return {
    title: video.title,
    description: video.description || `Watch ${video.title} on Lumina`,
    openGraph: {
      title: video.title,
      description: video.description || '',
      videos: [video.video_url],
    },
  };
}

export default async function VideoDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [settings, video, related, categories] = await Promise.all([
    getSettings(),
    getVideoById(id),
    getRelatedVideos(id),
    getCategories(),
  ]);

  if (!video) notFound();

  const category = categories.find((c) => c.id === video.category_id);

  return (
    <>
      <Header siteName={settings?.site_name} />
      <main className="pt-28 pb-20 min-h-screen">
        <div className="container-max px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VideoPlayer video={video} />

              <div className="mt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{video.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{formatNumber(video.views)} views</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(video.published_at || video.created_at)}</span>
                  {category && (
                    <Link href={`/videos?category=${category.id}`} className="flex items-center gap-1 text-brand-500 hover:underline">
                      <Tag className="w-4 h-4" />{category.name}
                    </Link>
                  )}
                </div>

                {video.description && (
                  <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">{video.description}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Related Videos</h3>
              <div className="space-y-3">
                {related.map((rv) => (
                  <Link key={rv.id} href={`/videos/${rv.id}`}>
                    <div className="group flex gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                        {rv.thumbnail_url && (
                          <img src={rv.thumbnail_url} alt={rv.title} className="w-full h-full object-cover" loading="lazy" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white/80" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{rv.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(rv.views)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer siteName={settings?.site_name} footerText={settings?.footer_text} />
    </>
  );
}
