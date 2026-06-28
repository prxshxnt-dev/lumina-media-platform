'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Layout, Image as ImageIcon, MousePointer, Link, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings, useUpdateSettings } from '@/hooks/use-settings';
import { useSupabase } from '@/hooks/use-supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HOMEPAGE_SECTIONS } from '@/lib/constants';

const tabs = [
  { key: 'branding', label: 'Branding', icon: Palette },
  { key: 'hero', label: 'Hero', icon: ImageIcon },
  { key: 'typography', label: 'Typography', icon: Type },
  { key: 'layout', label: 'Layout', icon: Layout },
  { key: 'cursor', label: 'Cursor', icon: MousePointer },
  { key: 'social', label: 'Social', icon: Link },
  { key: 'sections', label: 'Sections', icon: Layout },
];

export function AppearanceEditor() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const supabase = useSupabase();
  const [activeTab, setActiveTab] = useState('branding');
  const [form, setForm] = useState<Record<string, any>>({});

  // Sync form when settings load
  if (settings && Object.keys(form).length === 0 && !isLoading) {
    setForm(settings);
  }

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from('settings').update(form).eq('id', settings?.id).select().single();
      if (error) throw error;
      toast.success('Appearance updated! Changes are live.');
    } catch {
      toast.error('Failed to save changes');
    }
  };

  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appearance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your site without touching code</p>
        </div>
        <Button onClick={handleSave} className="group">
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key ? 'bg-brand-500/10 text-brand-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4"
          >
            {activeTab === 'branding' && (
              <>
                <Input label="Site Name" value={form.site_name || ''} onChange={(e) => update('site_name', e.target.value)} />
                <Input label="Logo URL" placeholder="https://..." value={form.logo_url || ''} onChange={(e) => update('logo_url', e.target.value)} />
                <Input label="Favicon URL" placeholder="https://..." value={form.favicon_url || ''} onChange={(e) => update('favicon_url', e.target.value)} />
                <Input label="Footer Text" value={form.footer_text || ''} onChange={(e) => update('footer_text', e.target.value)} />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Primary Color</label>
                    <input type="color" value={form.primary_color || '#6366f1'} onChange={(e) => update('primary_color', e.target.value)} className="w-full h-11 rounded-xl cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Secondary Color</label>
                    <input type="color" value={form.secondary_color || '#8b5cf6'} onChange={(e) => update('secondary_color', e.target.value)} className="w-full h-11 rounded-xl cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Accent Color</label>
                    <input type="color" value={form.accent_color || '#ec4899'} onChange={(e) => update('accent_color', e.target.value)} className="w-full h-11 rounded-xl cursor-pointer" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'hero' && (
              <>
                <Input label="Hero Title" value={form.hero_title || ''} onChange={(e) => update('hero_title', e.target.value)} />
                <Textarea label="Hero Subtitle" rows={3} value={form.hero_subtitle || ''} onChange={(e) => update('hero_subtitle', e.target.value)} />
                <Input label="Hero Background URL" placeholder="https://..." value={form.hero_bg_url || ''} onChange={(e) => update('hero_bg_url', e.target.value)} />
              </>
            )}

            {activeTab === 'typography' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Heading Font</label>
                  <select value={form.font_heading || 'Inter'} onChange={(e) => update('font_heading', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <option>Inter</option>
                    <option>Poppins</option>
                    <option>Roboto</option>
                    <option>Playfair Display</option>
                    <option>Montserrat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Body Font</label>
                  <select value={form.font_body || 'Inter'} onChange={(e) => update('font_body', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <option>Inter</option>
                    <option>Poppins</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Lato</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'layout' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Header Style</label>
                  <select value={form.header_style || 'glass'} onChange={(e) => update('header_style', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <option value="transparent">Transparent</option>
                    <option value="solid">Solid</option>
                    <option value="glass">Glass</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Button Style</label>
                  <select value={form.button_style || 'rounded'} onChange={(e) => update('button_style', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <option value="rounded">Rounded</option>
                    <option value="pill">Pill</option>
                    <option value="sharp">Sharp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Loader Style</label>
                  <select value={form.loader_style || 'pulse'} onChange={(e) => update('loader_style', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <option value="spinner">Spinner</option>
                    <option value="progress">Progress Bar</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'cursor' && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Custom Cursor Effects</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enable animated cursor with dot and ring</p>
                </div>
                <button
                  onClick={() => update('cursor_effects', !form.cursor_effects)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.cursor_effects ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <motion.div animate={{ x: form.cursor_effects ? 24 : 0 }} className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white" />
                </button>
              </div>
            )}

            {activeTab === 'social' && (
              <>
                <Input label="Twitter URL" placeholder="https://twitter.com/..." value={form.social_twitter || ''} onChange={(e) => update('social_twitter', e.target.value)} />
                <Input label="Instagram URL" placeholder="https://instagram.com/..." value={form.social_instagram || ''} onChange={(e) => update('social_instagram', e.target.value)} />
                <Input label="YouTube URL" placeholder="https://youtube.com/..." value={form.social_youtube || ''} onChange={(e) => update('social_youtube', e.target.value)} />
                <Input label="LinkedIn URL" placeholder="https://linkedin.com/..." value={form.social_linkedin || ''} onChange={(e) => update('social_linkedin', e.target.value)} />
                <Input label="GitHub URL" placeholder="https://github.com/..." value={form.social_github || ''} onChange={(e) => update('social_github', e.target.value)} />
              </>
            )}

            {activeTab === 'sections' && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Toggle and reorder homepage sections. Changes apply on save.</p>
                <div className="space-y-2">
                  {HOMEPAGE_SECTIONS.map((section) => {
                    const sectionData = (form.sections || []).find((s: any) => s.section_key === section.key);
                    return (
                      <div key={section.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{section.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{section.subtitle}</p>
                        </div>
                        <button className={`relative w-12 h-6 rounded-full transition-colors ${sectionData?.is_visible !== false ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                          <motion.div animate={{ x: sectionData?.is_visible !== false ? 24 : 0 }} className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
