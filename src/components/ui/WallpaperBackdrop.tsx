import type { ReactNode } from 'react';

interface WallpaperBackdropProps {
  children: ReactNode;
}

export function WallpaperBackdrop({ children }: WallpaperBackdropProps) {
  return (
    <div className="relative min-h-screen bg-slate-950 bg-[url('/wallpaper.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
