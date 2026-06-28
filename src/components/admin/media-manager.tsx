'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Edit, X, Search, Star, Download, Eye, Filter } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMedia, useCreateMedia, useUpdateMedia, useDeleteMedia } from '@/hooks/use-media';
import { useCategories } from '@/hooks/use-categories';
import { useUpload } from '@/hooks/use-upload';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/hooks/use-auth';
import { mediaSchema, type MediaInput } from '@/lib/validations';
import { MEDIA_TYPES, STORAGE_BUCKETS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBytes, formatNumber, cn } from '@/lib/utils';

export function MediaManager() {
  const { data, isLoading } = useMedia({ page: 1 });
  const { data: categories } = useCategories();
  const createMedia = useCreateMedia();
  const updateMedia = useUpdateMedia();
  const deleteMedia = useDeleteMedia();
  const { upload, uploading, progress } = useUpload();
  const supabase = useSupabase();
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    for (const file of acceptedFiles) {
      try {
        const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type.includes('pdf') ? 'pdf' : 'document';
        const bucket = type === 'image' ? 'IMAGES' : type === 'video' ? 'VIDEOS' : 'DOCUMENTS';
        const url = await upload(file, { bucket: bucket as keyof typeof STORAGE_BUCKETS });
        await createMedia.mutateAsync({
          title: file.name.replace(/\.[^.]+$/, ''),
          type: type as 'image' | 'video' | 'pdf' | 'document',
          url,
          thumbnail_url: type === 'image' ? url : null,
          file_size: file.size,
          file_format: file.type,
          status: 'draft',
          is_featured: false,
          is_downloadable: true,
          created_by: user.id,
        });
        toast.success(`${file.name} uploaded!`);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, [upload, createMedia, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [], 'application/pdf': [], '.doc': [], '.docx': [] },
  });

  const filtered = (data?.items ?? []).filter((item) => {
    if (filterType && item.type !== filterType) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return;
    try {
      await deleteMedia.mutateAsync(id);
      toast.success('Media deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateMedia.mutateAsync({ id, is_featured: !current });
      toast.success(!current ? 'Marked as featured' : 'Removed from featured');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{data?.total ?? 0} items</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="group">
          <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          Upload Media
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterType(null)} className={cn('px-3 py-2 rounded-lg text-sm font-medium', !filterType ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800')}>All</button>
          {MEDIA_TYPES.map((t) => (
            <button key={t.value} onClick={() => setFilterType(t.value)} className={cn('px-3 py-2 rounded-lg text-sm font-medium capitalize', filterType === t.value ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800')}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">No media found. Upload some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              <div className="relative aspect-square bg-gray-200 dark:bg-gray-800">
                {item.thumbnail_url && <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setEditing(item.id)} className="p-2 rounded-lg glass-strong text-white hover:bg-white/20"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleToggleFeatured(item.id, item.is_featured)} className="p-2 rounded-lg glass-strong text-white hover:bg-white/20"><Star className={cn('w-4 h-4', item.is_featured && 'fill-amber-400 text-amber-400')} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg glass-strong text-white hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Badge className="absolute top-2 left-2 capitalize" variant="primary">{item.type}</Badge>
                <Badge className="absolute top-2 right-2" variant={item.status === 'published' ? 'success' : 'warning'}>{item.status}</Badge>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>
                  {item.file_size && <span>{formatBytes(item.file_size)}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-lg glass-strong rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upload Media</h2>
                <button onClick={() => setShowUpload(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
              </div>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors',
                  isDragActive ? 'border-brand-500 bg-brand-500/5' : 'border-gray-300 dark:border-gray-700 hover:border-brand-500'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">{isDragActive ? 'Drop files here...' : 'Drag & drop files or click to browse'}</p>
                <p className="text-xs text-gray-400 mt-2">Images, Videos, PDFs, Documents</p>
              </div>
              {uploading && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">Uploading... {progress}%</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
