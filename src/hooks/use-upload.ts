'use client';

import { useState, useCallback } from 'react';
import { useSupabase } from './use-supabase';
import { STORAGE_BUCKETS } from '@/lib/constants';

interface UploadOptions {
  bucket: keyof typeof STORAGE_BUCKETS;
  path?: string;
  onProgress?: (progress: number) => void;
}

export function useUpload() {
  const supabase = useSupabase();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File, opts: UploadOptions): Promise<string> => {
    setUploading(true);
    setProgress(0);

    const bucketName = STORAGE_BUCKETS[opts.bucket];
    const ext = file.name.split('.').pop();
    const fileName = `${opts.path || ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      setUploading(false);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    setProgress(100);
    opts.onProgress?.(100);
    setUploading(false);

    return publicUrl;
  }, [supabase]);

  const uploadMultiple = useCallback(async (files: File[], opts: UploadOptions): Promise<string[]> => {
    const results: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await upload(files[i], {
        ...opts,
        onProgress: (p) => opts.onProgress?.(((i / files.length) * 100) + (p / files.length)),
      });
      results.push(url);
    }
    return results;
  }, [upload]);

  const remove = useCallback(async (bucket: keyof typeof STORAGE_BUCKETS, path: string) => {
    const bucketName = STORAGE_BUCKETS[bucket];
    const { error } = await supabase.storage.from(bucketName).remove([path]);
    if (error) throw error;
  }, [supabase]);

  return { upload, uploadMultiple, remove, uploading, progress };
}
