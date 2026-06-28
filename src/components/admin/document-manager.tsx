'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, X, Search, Download, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useSupabase } from '@/hooks/use-supabase';
import { useUpload } from '@/hooks/use-upload';
import { useAuth } from '@/hooks/use-auth';
import { documentSchema, type DocumentInput } from '@/lib/validations';
import { STORAGE_BUCKETS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBytes, formatNumber } from '@/lib/utils';

export function DocumentManager() {
  const supabase = useSupabase();
  const { upload, uploading, progress } = useUpload();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents
  useState(() => {
    supabase.from('documents').select('*, categories(*)').order('created_at', { ascending: false }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DocumentInput>({
    resolver: zodResolver(documentSchema) as any,
  });

  const filtered = items.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  const onSubmit = async (formData: DocumentInput) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('documents').insert({
        ...formData,
        created_by: user.id,
      }).select().single();
      if (error) throw error;
      setItems((prev) => [data, ...prev]);
      toast.success('Document added!');
      reset();
      setShowForm(false);
    } catch (err) {
      toast.error('Failed to add document');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await supabase.from('documents').delete().eq('id', id);
      setItems((prev) => prev.filter((d) => d.id !== id));
      toast.success('Document deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} documents</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Upload className="w-4 h-4" /> Add Document
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-500 dark:text-gray-400">No documents found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{doc.title}</p>
                  <Badge className="mt-1" variant={doc.status === 'published' ? 'success' : 'warning'}>{doc.status}</Badge>
                </div>
                <button onClick={() => handleDelete(doc.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{doc.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="uppercase">{doc.file_type}</span>
                {doc.file_size && <span>{formatBytes(doc.file_size)}</span>}
                <span className="flex items-center gap-1"><Download className="w-3 h-3" />{formatNumber(doc.downloads)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-lg glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add Document</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Title" placeholder="Document title" error={errors.title?.message} {...register('title')} />
                <Textarea label="Description" rows={3} placeholder="Document description" {...register('description')} />
                <Input label="File URL" placeholder="https://..." error={errors.file_url?.message} {...register('file_url')} />
                <Input label="File Type" placeholder="pdf, doc, txt..." {...register('file_type')} />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('is_downloadable')} className="rounded" /> Downloadable</label>
                </div>
                <Button type="submit" className="w-full">Add Document</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
