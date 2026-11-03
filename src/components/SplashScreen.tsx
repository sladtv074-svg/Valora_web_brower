import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';

const GREETING = 'Bonjour';
const FIRST_LETTER_DELAY_MS = 900;
const LETTER_INTERVAL_MS = 120;
const HOLD_MS = 1400;
const EXIT_MS = 600;

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const isComplete = visibleCount === GREETING.length;

  useEffect(() => {
    if (isComplete) return;
    const delay = visibleCount === 0 ? FIRST_LETTER_DELAY_MS : LETTER_INTERVAL_MS;
    const timer = window.setTimeout(() => setVisibleCount((count) => count + 1), delay);
    return () => window.clearTimeout(timer);
  }, [visibleCount, isComplete]);

  useEffect(() => {
    if (!isComplete) return;
    const hold = window.setTimeout(() => setLeaving(true), HOLD_MS);
    return () => window.clearTimeout(hold);
  }, [isComplete]);

  useEffect(() => {
    if (!leaving) return;
    const exit = window.setTimeout(onContinue, EXIT_MS);
    return () => window.clearTimeout(exit);
  }, [leaving, onContinue]);

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 ${
        leaving ? 'valora-splash-exit' : ''
      }`}
    >
      <div className="relative flex items-center justify-center">
        <p aria-label={GREETING} className="flex text-5xl font-semibold tracking-tight text-slate-900 sm:text-7xl">
          {GREETING.split('').slice(0, visibleCount).map((letter, index) => (
            <span key={index} className="valora-letter-in inline-block">
              {letter}
            </span>
          ))}
        </p>
        <div className="absolute inset-y-0 left-full flex items-center">
          <div className="valora-roll h-20 w-20 sm:h-28 sm:w-28">
            <Logo className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
