import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

const GREETING = 'Bonjour';
const FIRST_LETTER_DELAY_MS = 900;
const LETTER_INTERVAL_MS = 120;

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const isComplete = visibleCount === GREETING.length;

  useEffect(() => {
    if (isComplete) return;
    const delay = visibleCount === 0 ? FIRST_LETTER_DELAY_MS : LETTER_INTERVAL_MS;
    const timer = window.setTimeout(() => setVisibleCount((count) => count + 1), delay);
    return () => window.clearTimeout(timer);
  }, [visibleCount, isComplete]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6">
      <div className="relative flex items-center justify-center">
        <p
          aria-label={GREETING}
          className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-7xl"
        >
          {GREETING.slice(0, visibleCount)}
        </p>
        <div className="absolute inset-y-0 left-full flex items-center">
          <div className="valora-roll h-20 w-20 sm:h-28 sm:w-28">
            <Logo className="h-full w-full" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!isComplete}
        className={`mt-16 inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-slate-900/20 transition-all duration-500 hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/40 ${
          isComplete ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        Continuer
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
