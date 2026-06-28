'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'glass-strong rounded-xl border border-white/10',
          title: 'text-sm font-semibold',
          description: 'text-sm text-gray-500',
        },
      }}
    />
  );
}
