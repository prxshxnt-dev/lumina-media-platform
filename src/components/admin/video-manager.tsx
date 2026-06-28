'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Edit, X, Search, Star, Eye, Video as VideoIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useVideos, useCreateVideo, useDeleteVideo } from '@/hooks/use-videos';
import { useCategories } from '@/hooks/use-categories';
import { useUpload } from '@/hooks/use-upload';
import { useAuth } from '@/hooks/use-auth';
import { videoSchema, type VideoInput } from '@/lib/validations';
import { STORAGE_BUCKETS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, cn } from '@/lib/utils';

export function VideoManager() {
  const { data, isLoading } = useVideos({ page: 1 });
  const { data: categories } = useCategories();
  const createVideo = useCreateVideo();
  const deleteVideo = useDeleteVideo();
  const { upload, uploading, progress } = useUpload();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VideoInput>({
    resolver: zodResolver(videoSchema) as any,
  });

  const filtered = (data?.items ?? []).filter((v) => v.title.toLowerCase().includes(search.toLowerCase()));

  const onSubmit = async (formData: VideoInput) => {
    if (!user) return;
    try {
      await createVideo.mutateAsync({
        ...formData,
        created_by: user.id,
      });
      toast.success('Video added!');
      reset();
      setShowForm(false);
    } catch (err) {
      toast.error('Failed to add video');
    }
  };

  const handleFileUpload = async (file: File, field: 'video_url' | 'thumbnail_url') => {
    try {
      const bucket = field === 'video_url' ? 'VIDEOS' : 'THUMBNAILS';
      const url = await upload(file, { bucket: bucket as keyof typeof STORAGE_BUCKETS });
      return url;
    } catch {
      toast.error('Upload failed');
      return null;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      await deleteVideo.mutateAsync(id);
      toast.success('Video deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{data?.total ?? 0} videos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Upload className="w-4 h-4" /> Add Video
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-video rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-500 dark:text-gray-400">No videos found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((video) => (
            <motion.div key={video.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
                {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleDelete(video.id)} className="p-2 rounded-lg glass-strong text-white hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Badge className="absolute top-2 right-2" variant={video.status === 'published' ? 'success' : 'warning'}>{video.status}</Badge>
                {video.is_featured && <Star className="absolute top-2 left-2 w-5 h-5 fill-amber-400 text-amber-400" />}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{video.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(video.views)}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" />{formatNumber(video.likes)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add Video</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Title" placeholder="Video title" error={errors.title?.message} {...register('title')} />
                <Textarea label="Description" rows={3} placeholder="Video description" {...register('description')} />
                <Input label="Video URL" placeholder="https://..." error={errors.video_url?.message} {...register('video_url')} />
                <Input label="Thumbnail URL" placeholder="https://..." {...register('thumbnail_url')} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category</label>
                    <select {...register('category_id')} className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <option value="">None</option>
                      {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Status</label>
                    <select {...register('status')} className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_featured')} className="rounded" /> Featured</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_downloadable')} className="rounded" /> Downloadable</label>
                </div>
                {uploading && (
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}
                <Button type="submit" disabled={createVideo.isPending} className="w-full">
                  {createVideo.isPending ? 'Adding...' : 'Add Video'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
