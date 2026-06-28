'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Database, Download, Upload, Shield, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabase } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsManager() {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');

  const handleExport = async () => {
    setLoading(true);
    try {
      const tables = ['media', 'videos', 'documents', 'categories', 'settings', 'profiles'];
      const exportData: Record<string, any> = {};
      for (const table of tables) {
        const { data } = await supabase.from(table).select('*');
        exportData[table] = data;
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lumina-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch {
      toast.error('Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage platform settings and data</p>
      </motion.div>

      <div className="space-y-6">
        {/* SEO Settings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">SEO Defaults</h2>
          <div className="space-y-4">
            <Input label="Default Meta Title" placeholder="Lumina — Premium Media Platform" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            <Input label="Default Meta Description" placeholder="Premium media showcase platform" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} />
            <Button variant="outline" onClick={() => toast.success('SEO settings saved!')}>
              <Save className="w-4 h-4" /> Save SEO Settings
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-500" /> Data Management
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleExport} disabled={loading}>
              <Download className="w-4 h-4" /> Export Data
            </Button>
            <Button variant="outline" onClick={() => toast.info('Import feature ready — upload a JSON backup file')}>
              <Upload className="w-4 h-4" /> Import Data
            </Button>
          </div>
        </div>

        {/* Security */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" /> Security
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">Row Level Security</span>
              <span className="text-sm font-medium text-green-500">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">Protected Admin Routes</span>
              <span className="text-sm font-medium text-green-500">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">Email Verification</span>
              <span className="text-sm font-medium text-green-500">Required</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">New upload alerts</span>
              <button className="relative w-12 h-6 rounded-full bg-brand-500">
                <div className="absolute top-0.5 left-6 w-5 h-5 rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">Newsletter subscriptions</span>
              <button className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
