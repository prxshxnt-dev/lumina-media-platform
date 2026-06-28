'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Search, Home, Image, Video, FileText, Info, Mail, LayoutDashboard, Settings } from 'lucide-react';
import { useEffect } from 'react';

const commands = [
  { label: 'Go to Home', href: '/', icon: Home },
  { label: 'Browse Gallery', href: '/gallery', icon: Image },
  { label: 'Watch Videos', href: '/videos', icon: Video },
  { label: 'View Documents', href: '/documents', icon: FileText },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Admin Panel', href: '/admin', icon: Settings },
];

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <Command
        className="relative w-full max-w-lg rounded-2xl glass-strong shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        loop
      >
        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400" />
          <Command.Input
            placeholder="Search or jump to..."
            className="flex-1 bg-transparent border-0 outline-none py-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            autoFocus
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-gray-400">
            No results found.
          </Command.Empty>
          {commands.map((cmd) => (
            <Command.Item
              key={cmd.href}
              onSelect={() => {
                router.push(cmd.href);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-brand-500/10 aria-selected:text-brand-500 text-gray-700 dark:text-gray-300"
            >
              <cmd.icon className="w-4 h-4 text-gray-400" />
              {cmd.label}
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
