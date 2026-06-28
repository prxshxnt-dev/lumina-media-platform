'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Eye, Heart } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { formatNumber } from '@/lib/utils';
import type { Video } from '@/types';

export function FeaturedVideos({ videos }: { videos: Video[] }) {
  if (!videos.length) return null;
  return (
    <section className="section-padding">
      <div className="container-max">
        <SectionHeading
          eyebrow="Watch"
          title="Featured Videos"
          subtitle="Immerse yourself in our handpicked selection of premium video content."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 6).map((video, i) => (
            <Reveal key={video.id} delay={i * 0.1}>
              <Link href={`/videos/${video.id}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video cursor-pointer"
                >
                  {video.thumbnail_url && (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
