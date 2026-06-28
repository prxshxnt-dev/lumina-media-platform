'use client';

import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Only enable on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('a, button, [role="button"], input, textarea, select'));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        className="cursor-dot"
        style={{ transform: `translate(${position.x - 4}px, ${position.y - 4}px) scale(${hovering ? 1.5 : 1})` }}
      />
      <div
        className="cursor-ring"
        style={{
          transform: `translate(${position.x - 18}px, ${position.y - 18}px) scale(${hovering ? 1.3 : 1})`,
          width: hovering ? '48px' : '36px',
          height: hovering ? '48px' : '36px',
        }}
      />
    </>
  );
}
