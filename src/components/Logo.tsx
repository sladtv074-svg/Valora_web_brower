import { useEffect, useState } from 'react';
import { getTransparentLogo, LOGO_SRC } from '@/lib/logoImage';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const [src, setSrc] = useState(LOGO_SRC);

  useEffect(() => {
    let active = true;
    getTransparentLogo()
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return <img src={src} alt="" aria-hidden="true" draggable={false} className={`select-none object-contain ${className ?? ''}`} />;
}
