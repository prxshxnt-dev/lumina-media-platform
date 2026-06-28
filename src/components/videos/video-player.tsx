'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Share2, Heart, Download, SkipBack, SkipForward } from 'lucide-react';
import { toast } from 'sonner';
import type { Video } from '@/types';
import { useSupabase } from '@/hooks/use-supabase';

export function VideoPlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const supabase = useSupabase();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Increment view count
    supabase.rpc('increment_video_views', { video_id: video.id }).then(({ error }) => {
      if (error) console.warn('Failed to increment views:', error.message);
    });
  }, [video.id, supabase]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(!muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(pct);
    setCurrent(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  };

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const handleLike = async () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    const { error } = await supabase.rpc('toggle_video_like', { video_id: video.id });
    if (error) {
      setLiked(!liked);
      setLikes(liked ? likes + 1 : likes - 1);
      toast.error('Failed to like video');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleDownload = () => {
    if (!video.is_downloadable) {
      toast.error('Downloads are disabled for this video');
      return;
    }
    const a = document.createElement('a');
    a.href = video.video_url;
    a.download = video.title;
    a.click();
  };

  const showControlsTemp = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden bg-black aspect-video group"
      onMouseMove={showControlsTemp}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={video.video_url}
        poster={video.thumbnail_url || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlaying(false)}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <button onClick={handleLike} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-strong text-white text-sm hover:bg-white/20 transition-colors">
                  <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {likes}
                </button>
                <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-strong text-white text-sm hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                {video.is_downloadable && (
                  <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-strong text-white text-sm hover:bg-white/20 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
              </div>
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg glass-strong text-white hover:bg-white/20 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Center play button */}
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                <button onClick={togglePlay} className="w-20 h-20 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </button>
              </div>
            )}

            {/* Bottom controls */}
            <div className="pointer-events-auto">
              {/* Progress bar */}
              <div className="h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/bar" onClick={handleSeek}>
                <div className="h-full bg-brand-500 rounded-full relative transition-all" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-500 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-brand-400 transition-colors">
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} className="text-white hover:text-brand-400 transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} className="text-white hover:text-brand-400 transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-brand-400 transition-colors">
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-white text-xs font-medium">{formatTime(current)} / {formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {showSettings && (
                    <div className="absolute bottom-16 right-4 glass-strong rounded-xl p-2 space-y-1">
                      <p className="text-xs text-white/70 px-2 py-1">Playback Speed</p>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm text-white hover:bg-white/10 transition-colors ${playbackRate === rate ? 'bg-brand-500' : ''}`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-white text-xs font-medium">{playbackRate}x</span>
                  <button onClick={toggleFullscreen} className="text-white hover:text-brand-400 transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
