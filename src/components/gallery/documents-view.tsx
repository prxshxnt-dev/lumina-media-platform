'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Download, Eye, File } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBytes, formatNumber } from '@/lib/utils';
import { toast } from 'sonner';
import type { Document, Category } from '@/types';

interface DocumentsViewProps {
  initialItems: Document[];
  categories: Category[];
  total: number;
}

export function DocumentsView({ initialItems, total }: DocumentsViewProps) {
  const supabase = useSupabase();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(initialItems);

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (doc: Document) => {
    if (!doc.is_downloadable) {
      toast.error('Downloads are disabled for this document');
      return;
    }
    // Increment download count
    await supabase.rpc('increment_document_downloads', { doc_id: doc.id });
    const a = document.createElement('a');
    a.href = doc.file_url;
    a.download = doc.title;
    a.click();
    toast.success('Download started!');
  };

  return (
    <div className="container-max px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Documents</h1>
        <p className="text-gray-500 dark:text-gray-400">{total} documents available</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <File className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No documents found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{doc.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{doc.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="uppercase">{doc.file_type}</span>
                    {doc.file_size && <span>{formatBytes(doc.file_size)}</span>}
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" />{formatNumber(doc.downloads)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDownload(doc)}
                disabled={!doc.is_downloadable}
                className="mt-4 w-full btn-secondary text-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {doc.is_downloadable ? 'Download' : 'Download Disabled'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
